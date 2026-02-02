import { useState, useRef, useEffect, useCallback, memo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Popper,
  Fade,
  CircularProgress,
  IconButton,
} from '@mui/material';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import BusinessIcon from '@mui/icons-material/Business';
import EventIcon from '@mui/icons-material/Event';
import CloseIcon from '@mui/icons-material/Close';
import FlightIcon from '@mui/icons-material/Flight';
import GroupsIcon from '@mui/icons-material/Groups';
import WarningIcon from '@mui/icons-material/Warning';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { dataService } from '../../services/dataService';
import urlsMap from '../../services/urlsMap';
// Entity type detection
const getEntityCategory = (entityType) => {
  const type = entityType?.toLowerCase() || '';
  // Include ship types (ShipVariant, ShipFamily, ShipInstance) as equipment category
  if (type.includes('equipmentvariant') || type.includes('equipmentfamily') || type.includes('equipment') ||
    type.includes('shipvariant') || type.includes('shipfamily') || type.includes('shipinstance')) return 'equipment';
  if (type.includes('militarygroup')) return 'military';
  if (type.includes('organization')) return 'organization';
  if (type.includes('event') || type.includes('attack') || type.includes('action')) return 'event';
  if (type.includes('installation')) return 'installation';
  return 'unknown';
};

// Get icon for entity type - accepts optional originalType for ship-specific icon
const getEntityIcon = (category, originalType = '') => {
  // Check for ship types first to show boat icon
  const typeLower = originalType?.toLowerCase() || '';
  if (typeLower.includes('ship')) {
    return <DirectionsBoatIcon sx={{ fontSize: 20 }} />;
  }

  switch (category) {
    case 'equipment': return <PrecisionManufacturingIcon sx={{ fontSize: 20 }} />;
    case 'military': return <MilitaryTechIcon sx={{ fontSize: 20 }} />;
    case 'organization': return <BusinessIcon sx={{ fontSize: 20 }} />;
    case 'event': return <EventIcon sx={{ fontSize: 20 }} />;
    case 'installation': return <WarehouseIcon sx={{ fontSize: 20 }} />;
    default: return <PrecisionManufacturingIcon sx={{ fontSize: 20 }} />;
  }
};

// Parse image response from images API (similar to useEquipmentImages hook)
const parseImagesApiResponse = (data, baseImageUrl) => {
  const images = [];

  // Handle different response formats
  const results = data?.result || data?.resultRows || [];

  results.forEach((row) => {
    // Format 1: Array format [body, assets]
    if (Array.isArray(row)) {
      const body = row[0];
      const assets = row[1];

      if (!body || !assets || !Array.isArray(assets)) return;

      // Parse HTML to get captions
      let htmlDom = null;
      try {
        htmlDom = new DOMParser().parseFromString(body, "text/html");
      } catch (e) {
        // Continue without captions
      }

      assets.forEach((asset) => {
        const props = asset.properties || asset;
        if (!props.id) return;

        const assetId = props.id.trim().split("/").pop();

        // Find caption from HTML
        let caption = '';
        if (htmlDom) {
          const captionElement = Array.from(htmlDom.querySelectorAll("data"))
            .find((e) => {
              const value = e.getAttribute("value");
              return value && value.split("/").pop() === assetId;
            });
          caption = captionElement?.getAttribute("data-caption") || '';
        }

        // Construct image path using baseImageUrl
        const imgPath = baseImageUrl
          ? `${baseImageUrl}/images/${assetId}.jpg`
          : `https://asset.janes.com/image/${assetId}`;

        images.push({ id: assetId, url: imgPath, caption });
      });
    }
    // Format 2: Object format with c.body and subGroups
    else if (row && typeof row === 'object') {
      const body = row['c.body'] || row.body || '';
      const subGroups = row.subGroups || [];

      let htmlDom = null;
      if (body) {
        try {
          htmlDom = new DOMParser().parseFromString(body, "text/html");
        } catch (e) { }
      }

      subGroups.forEach((item) => {
        const assetId = item.id?.trim().split("/").pop();
        if (!assetId) return;

        let caption = '';
        if (htmlDom) {
          const captionElement = Array.from(htmlDom.querySelectorAll("data"))
            .find((e) => {
              const value = e.getAttribute("value");
              return value && value.split("/").pop() === assetId;
            });
          caption = captionElement?.getAttribute("data-caption") || '';
        }

        // Check if id is already a full URL
        const imgPath = item.id?.includes('http')
          ? item.id
          : baseImageUrl
            ? `${baseImageUrl}/images/${assetId}.jpg`
            : `https://asset.janes.com/image/${assetId}`;

        images.push({ id: assetId, url: imgPath, caption });
      });
    }
  });

  return images;
};

// Extract first image URL from various possible response structures
const extractFirstImageUrl = (data) => {
  if (!data) return null;

  // Try multiple possible paths for image URL
  const result = data?.result?.[0] || data?.result || data;

  // Path 1: result.subGroups[0].id (dummy data format)
  if (result?.subGroups?.[0]?.id) {
    return result.subGroups[0].id;
  }

  // Path 2: result.subGroups[0].url
  if (result?.subGroups?.[0]?.url) {
    return result.subGroups[0].url;
  }

  // Path 3: result.images[0].id or result.images[0].url
  if (result?.images?.[0]?.id) {
    return result.images[0].id;
  }
  if (result?.images?.[0]?.url) {
    return result.images[0].url;
  }

  // Path 4: result.assets[0].id or result.assets[0].url
  if (result?.assets?.[0]?.id) {
    return result.assets[0].id;
  }
  if (result?.assets?.[0]?.url) {
    return result.assets[0].url;
  }

  // Path 5: Direct image_url or imageUrl field
  if (result?.image_url) {
    return result.image_url;
  }
  if (result?.imageUrl) {
    return result.imageUrl;
  }

  // Path 6: Check in e.properties for image fields
  if (result?.e?.properties?.image_url) {
    return result.e.properties.image_url;
  }
  if (result?.e?.properties?.imageUrl) {
    return result.e.properties.imageUrl;
  }

  // Path 7: Parse from c.body HTML if available (contains data tags with image URLs)
  const body = result?.['c.body'] || result?.body || '';
  if (body) {
    // Extract first data value (image URL) from HTML
    const match = body.match(/data\s+value="([^"]+)"/);
    if (match && match[1] && match[1].includes('asset')) {
      return match[1];
    }
  }

  return null;
};

// Fetch equipment images using dataService
const fetchEquipmentImages = async (equipmentId, baseImageUrl = null) => {
  try {
    const data = await dataService.equipment.getImages(equipmentId);

    // Try to extract first image URL from various possible response structures
    const firstImageUrl = extractFirstImageUrl(data);
    if (firstImageUrl) {
      return [{ url: firstImageUrl, caption: '' }];
    }

    // Fallback: Try to parse images from the response body using parseImagesApiResponse
    const images = parseImagesApiResponse(data, baseImageUrl);
    if (images.length > 0) {
      return [images[0]]; // Return only first image
    }

    console.warn('No images found in equipment images API response');
    return [];
  } catch (error) {
    console.error('Error fetching equipment images:', error);
    return [];
  }
};

// Map category to entity_type for entity_search API
const getCategoryEntityType = (category, originalType = '') => {
  // For equipment types (variant/family) and ship types, always use 'equipment' for search
  // The specific type is used later for profile fetching
  const typeLower = originalType?.toLowerCase() || '';
  if (typeLower.includes('equipment') || typeLower.includes('ship')) return 'equipment';

  switch (category) {
    case 'equipment': return 'equipment';
    case 'military': return 'militarygroup';
    case 'organization': return 'organization';
    case 'event': return 'event';
    case 'installation': return 'installation';
    default: return '';
  }
};

// Fetch entity data using dataService
const fetchEntityData = async (entityName, entityType) => {
  const category = getEntityCategory(entityType);

  try {
    // Step 1: First search for the entity to get its ID
    const searchData = await dataService.entitySearch.search(entityName, getCategoryEntityType(category, entityType));
    const searchResult = searchData?.result?.[0];

    // Extract entity_id from search result - check entity_id first (dummy data format)
    const entityId = searchResult?.entity_id || searchResult?.id || searchResult?.e?.properties?.id;

    if (!entityId) {
      console.warn('No entity ID found for:', entityName, 'Search result:', searchResult);
      return null;
    }

    // Step 2: Fetch the full profile using the appropriate dataService method
    let profileData = null;
    switch (category) {
      case 'equipment':
        profileData = await dataService.equipment.getProfile(entityId);
        break;
      case 'military':
        profileData = await dataService.militaryGroup.getProfile(entityId);
        break;
      case 'organization':
        profileData = await dataService.manufacturer.getDetails(entityId);
        break;
      case 'event':
        profileData = await dataService.event.getProfile(entityId);
        break;
      case 'installation':
        profileData = await dataService.installation.getProfile(entityId);
        break;
      default:
        return null;
    }

    // Handle different response structures
    let result;
    if (category === 'installation') {
      // Installation profile returns { result: [installationData] }
      result = profileData?.result?.[0] || profileData || null;
    } else if (category === 'military' && profileData?.resultRows) {
      // Military group dummy data returns resultRows format - transform it
      const row = profileData.resultRows[0];
      if (row) {
        result = {
          e: row[0],
          subGroups: row[1] || [],
          subGroups2: row[2] || [],
          subGroups3: row[3] || [],
          equipment: row[4] || [],
          installations: row[5] || [],
        };
      }
    } else if (category === 'military' && profileData?.result) {
      // Military group with result array format
      result = profileData.result[0] || null;
    } else if (category === 'equipment' && profileData?.resultRows) {
      // Equipment dummy data returns resultRows format - transform it
      const row = profileData.resultRows[0];
      if (row) {
        result = {
          e: row[0],
          subGroups: row[1] || [],
          subGroups2: row[2] || [],
          subGroups3: row[3] || [],
          subGroups4: row[4] || [],
          subGroups5: row[5] || [],
          subGroups6: row[6] || [],
          subGroups7: row[7] || [],
          subGroups8: row[8] || [],
        };
      }
    } else {
      result = profileData?.result?.[0] || null;
    }

    let images = [];
    if (category === 'equipment') {
      // Determine the correct ID for fetching images
      let equipmentIdForImages = null;

      // For EquipmentFamily/EquipmentVariant and ShipFamily/ShipVariant/ShipInstance, try to get ID from subGroups first
      const typeLower = entityType?.toLowerCase() || '';
      if (typeLower.includes('equipmentfamily') || typeLower.includes('equipmentvariant') ||
        typeLower.includes('shipfamily') || typeLower.includes('shipvariant') || typeLower.includes('shipinstance')) {
        // Try subGroups for family/variant images - check various subgroup locations
        equipmentIdForImages = result?.subGroups?.[0]?.id ||
          result?.subGroups5?.[0]?.id ||
          result?.subGroups6?.[0]?.id ||
          result?.subGroups3?.[0]?.id ||
          result?.subGroups4?.[0]?.id ||
          result?.e?.properties?.id ||
          entityId;
      } else {
        // Standard equipment - use main entity ID
        equipmentIdForImages = result?.e?.properties?.id || entityId;
      }

      if (equipmentIdForImages) {
        // Pass baseImageUrl from urlsMap for proper image URL construction
        const baseImageUrl = urlsMap.assetsService || null;
        images = await fetchEquipmentImages(equipmentIdForImages, baseImageUrl);
      }
    }

    return { category, data: result, images };
  } catch (error) {
    console.error('Error fetching entity data:', error);
    return null;
  }
};

// Generate Wikipedia-style paragraph for Equipment and Ships
const parseEquipmentData = (data, images = []) => {
  const props = data?.e?.properties || data;
  if (!props) return null;

  // Get variant type from entity labels to detect ship types
  const variantType = data?.e?.labels?.[0] || props?.type || '';
  const isShipEntity = variantType.toLowerCase().includes('ship');

  const equipmentType = props.equipment_type || '';
  const role = props.role || '';
  const domain = props.operational_domain || '';
  const mobility = props.mobility || '';
  const operation = props.operation || '';
  const endUser = props.end_user_type || '';
  const designation = props.designation || props.equipment_designation || '';
  const countryOfOrigin = props.country_of_origin || props.origin_country || '';
  const inService = props.in_service || props.service_status || '';

  // Ship-specific fields
  const pennantNumber = props.pennant_number_label || '';
  const shipDesignator = props.designator_ship_designator || '';
  const designatorLabel = props.designator_label || '';
  const coreTypeDesignator = props.designator_core_type_designator || '';
  const designatorSuffix = props.designator_designator_suffix || '';

  // Get equipment family from subGroups5 (in_family) or subGroups6 (overall_family)
  const equipmentFamily = data?.subGroups5?.[0]?.label || data?.subGroups6?.[0]?.label || '';

  // Get derived from (subGroups3) and parent equipment (subGroups4)
  const derivedFrom = data?.subGroups3?.[0]?.label || '';
  const parentEquipment = data?.subGroups4?.[0]?.label || '';

  const specs = data?.subGroups || [];
  const specList = specs.slice(0, 3).map(spec => {
    const p = spec.properties?.properties || spec.properties || spec;
    return { name: p?.label || p?.name, value: p?.rendered_output };
  }).filter(s => s.name && s.value);

  // Build Wikipedia-style paragraph with all available fields
  let paragraph = '';
  const types = equipmentType.split(',').map(t => t.trim().toLowerCase());
  const roles = role.split(',').map(r => r.trim().toLowerCase());

  // Opening classification - different for ships vs equipment
  if (isShipEntity) {
    // Ship-specific opening
    if (shipDesignator) {
      paragraph = `is a ${shipDesignator.toLowerCase()}`;
    } else if (types.length > 0 && types[0]) {
      paragraph = `is a ${types.slice(0, 2).join(', ')} vessel`;
    } else {
      paragraph = 'is a naval vessel';
    }

    // Pennant number / hull number
    if (pennantNumber) {
      paragraph += ` with pennant number ${pennantNumber}`;
    }

    // Designator label (e.g., DDG)
    if (designatorLabel) {
      paragraph += ` (${designatorLabel})`;
    }
  } else {
    // Equipment opening
    if (types.length > 0 && types[0]) {
      paragraph = `is a ${types.slice(0, 2).join(', ')} platform`;
    } else if (variantType) {
      paragraph = `is a ${variantType.toLowerCase()}`;
    } else {
      paragraph = 'is a military equipment';
    }

    // Designation
    if (designation) {
      paragraph += ` (${designation})`;
    }
  }

  // Family relationship
  if (equipmentFamily) {
    paragraph += ` in the ${equipmentFamily} ${isShipEntity ? 'class' : 'family'}`;
  }

  // Derived from / variant info
  if (derivedFrom) {
    paragraph += `, derived from the ${derivedFrom}`;
  } else if (parentEquipment) {
    paragraph += `, a variant of the ${parentEquipment}`;
  }

  // Country of origin
  if (countryOfOrigin) {
    paragraph += `, ${isShipEntity ? 'operated by' : 'developed by'} ${countryOfOrigin}`;
  }

  paragraph += '.';

  // Role and purpose
  if (roles.length > 0 && roles[0]) {
    paragraph += ` Designed for ${roles.slice(0, 3).join(', ')} ${isShipEntity ? 'operations' : 'missions'}.`;
  }

  // Ship-specific: Core type designator
  if (isShipEntity && coreTypeDesignator) {
    paragraph += ` Classified as ${coreTypeDesignator.toLowerCase()}.`;
  }

  // Operational characteristics
  if (domain || mobility || operation) {
    paragraph += ' It';
    if (domain) {
      paragraph += ` operates in the ${domain.toLowerCase()} domain`;
    }
    if (mobility && !isShipEntity) {
      paragraph += `${domain ? ',' : ''} features ${mobility.toLowerCase()} mobility`;
    }
    if (operation) {
      paragraph += `${domain || (mobility && !isShipEntity) ? ', and is' : ' is'} ${operation.toLowerCase()}`;
    }
    paragraph += '.';
  }

  // End user
  if (endUser) {
    paragraph += ` Primarily used by ${endUser.toLowerCase()}.`;
  }

  // Service status
  if (inService) {
    paragraph += ` Service status: ${inService.toLowerCase()}.`;
  }

  // Key specifications
  if (specList.length > 0) {
    const specStr = specList.slice(0, 2).map(s => `${s.name}: ${s.value}`).join('; ');
    paragraph += ` Key specs: ${specStr}.`;
  }

  const imageUrl = images?.[0]?.url || images?.[0]?.image_url || null;

  // Facts for compact display - different for ships vs equipment
  let facts;
  if (isShipEntity) {
    facts = [
      { label: 'Pennant', value: pennantNumber },
      { label: 'Class', value: equipmentFamily },
      { label: 'Designator', value: designatorLabel },
      { label: 'Type', value: shipDesignator || equipmentType.split(',').slice(0, 2).map(t => t.trim()).join(', ') },
      { label: 'Category', value: coreTypeDesignator },
      { label: 'Role', value: role.split(',').slice(0, 2).map(r => r.trim()).join(', ') },
      { label: 'Operator', value: countryOfOrigin },
      { label: 'Domain', value: domain },
      { label: 'Status', value: inService },
    ].filter(f => f.value && f.value !== 'nan');
  } else {
    facts = [
      { label: 'Family', value: equipmentFamily },
      { label: 'Derived From', value: derivedFrom },
      { label: 'Parent', value: parentEquipment },
      { label: 'Origin', value: countryOfOrigin },
      { label: 'Designation', value: designation },
      { label: 'Role', value: role.split(',').slice(0, 2).map(r => r.trim()).join(', ') },
      { label: 'Type', value: equipmentType.split(',').slice(0, 2).map(t => t.trim()).join(', ') },
      { label: 'Domain', value: domain },
      { label: 'Status', value: inService },
    ].filter(f => f.value && f.value !== 'nan');
  }

  return {
    type: isShipEntity ? 'ship' : 'equipment',
    imageUrl,
    paragraph: paragraph || (isShipEntity ? 'naval vessel.' : 'equipment platform.'),
    facts: facts.slice(0, 6),
    tags: [
      domain,
      isShipEntity ? designatorLabel : mobility,
      operation,
      countryOfOrigin,
    ].filter(Boolean).slice(0, 4),
  };
};

// Generate Wikipedia-style paragraph for Military Group (informative preview)
const parseMilitaryData = (data) => {
  const props = data?.e?.properties || data;
  if (!props) return null;

  // Extract all relevant fields from e.properties
  const branch = props.branch || '';
  const echelon = props.echelon || props.indigenous_echelon || '';
  const indigenousName = props.indigenous_name_label || '';
  const translationLabel = props.translation_label || '';
  const synonymLabel = props.synonym_label || '';
  const shortName = props.short_name_label || '';
  const garrison = props.garrison || props.garrison_location || '';
  const motto = props.motto || '';
  const founded = props.founded || props.established || '';

  // From subGroups2 and subGroups3 - handle both wrapped and direct formats
  const subGroup2Item = data?.subGroups2?.[0];
  const parentGroup = subGroup2Item?.properties?.parent_group || subGroup2Item?.parent_group || '';

  const subGroup3Item = data?.subGroups3?.[0];
  const withinOrbat = subGroup3Item?.properties?.within_orbat || subGroup3Item?.within_orbat || '';
  const orbatType = subGroup3Item?.properties?.orbat_type || subGroup3Item?.orbat_type || '';

  // From subGroups (GroupInOrbat) - handle both wrapped and direct formats
  const subGroupItem = data?.subGroups?.[0];
  const orbatInfo = subGroupItem?.properties || subGroupItem || {};
  const operationalDomain = orbatInfo.operational_domain || '';
  const domainType = orbatInfo.operational_domain_type || '';
  const unitType = orbatInfo.unit_type || '';
  const dutyStatus = orbatInfo.orbat_duty_status || '';

  // Equipment and location - handle both wrapped and direct formats
  const equipmentArray = data?.equipment || [];
  const equipment = equipmentArray.map(e => e?.properties || e);
  const equipmentList = equipment.slice(0, 4).map(e => e.label).join(', ');

  const installationsArray = data?.installations || [];
  const firstInstallation = installationsArray[0]?.properties || installationsArray[0];
  const location = firstInstallation?.label || garrison || '';

  // Build informative Wikipedia-style paragraph with all fields
  let paragraph = '';

  // Opening with classification and echelon
  if (echelon) {
    paragraph = `is a ${echelon.toLowerCase()}`;
  } else {
    paragraph = 'is a military formation';
  }

  // Unit type classification
  if (unitType) {
    paragraph += ` (${unitType.toLowerCase()})`;
  }

  // Branch affiliation
  if (branch) {
    paragraph += ` of the ${branch}`;
  }

  // Founded date
  if (founded) {
    paragraph += `, established in ${founded}`;
  }

  // ORBAT structure
  if (withinOrbat) {
    paragraph += `, part of the ${withinOrbat}`;
    if (orbatType) {
      paragraph += ` ${orbatType}`;
    }
  }

  paragraph += '.';

  // Indigenous/local name
  if (indigenousName) {
    paragraph += ` Known locally as "${indigenousName}"`;
    if (translationLabel) {
      paragraph += ` (meaning: ${translationLabel})`;
    }
    paragraph += '.';
  }

  // Alternative names/designations
  if (synonymLabel && synonymLabel !== indigenousName) {
    paragraph += ` Also designated as ${synonymLabel}.`;
  }
  if (shortName) {
    paragraph += ` Abbreviated: ${shortName}.`;
  }

  // Command hierarchy
  if (parentGroup) {
    paragraph += ` Reports to ${parentGroup}.`;
  }

  // Operational capability
  if (operationalDomain || domainType) {
    paragraph += ' Conducts';
    if (operationalDomain) {
      paragraph += ` ${operationalDomain.toLowerCase()}`;
    }
    if (domainType) {
      paragraph += ` ${domainType.toLowerCase()}`;
    }
    paragraph += ' operations.';
  }

  // Base location
  if (location) {
    paragraph += ` Based at ${location}.`;
  }

  // Equipment inventory
  if (equipmentList) {
    paragraph += ` Operates ${equipmentList}${equipment.length > 4 ? ' and more' : ''}.`;
  }

  // Motto
  if (motto) {
    paragraph += ` Unit motto: "${motto}".`;
  }

  // Current status
  if (dutyStatus) {
    paragraph += ` Currently ${dutyStatus.toLowerCase()}.`;
  }

  // Comprehensive facts - all essential items
  const facts = [
    { label: 'Branch', value: branch },
    { label: 'Echelon', value: echelon },
    { label: 'Domain', value: operationalDomain + (domainType ? ` / ${domainType}` : '') },
    { label: 'Unit Type', value: unitType },
    { label: 'Parent', value: parentGroup },
    { label: 'ORBAT', value: withinOrbat + (orbatType ? ` (${orbatType})` : '') },
    { label: 'Location', value: location },
    { label: 'Founded', value: founded },
    { label: 'Short Name', value: shortName },
    { label: 'Status', value: dutyStatus },
    { label: 'Synonym', value: synonymLabel },
  ].filter(f => f.value);

  return {
    type: 'military',
    imageUrl: null,
    paragraph: paragraph || 'Military organizational unit.',
    facts: facts.slice(0, 7),
    equipment: equipment, // Full equipment array for display
    tags: [branch, operationalDomain, dutyStatus, echelon].filter(Boolean).slice(0, 4),
  };
};

// Generate Wikipedia-style paragraph for Organization - Minimal summary version
const parseOrganizationData = (data) => {
  // Handle multiple API response structures:
  // 1. manufacturer_details: data.organization
  // 2. manufacturer: data.c.properties
  // 3. generic: data.e.properties
  const org = data?.organization || data?.c?.properties || data?.e?.properties || data;
  if (!org) return null;

  // Extract essential fields only
  const orgType = org.organization_type || '';
  const orgSubType = org.organization_sub_type || '';

  // Country - handle different formats
  const country = data?.country_of_domicile || data?.['m.name'] || org.country || '';

  const ownership = org.ownership || '';
  const status = org.status || '';
  const foundedYear = org.founded || org.year_founded || '';

  // Build minimal Wikipedia-style paragraph - just essential info
  let paragraph = '';

  // Organization type and classification
  if (orgType) {
    paragraph = `is a ${orgType.toLowerCase()} organization`;
    if (orgSubType && orgSubType !== 'Global Ultimate') {
      paragraph += ` classified as ${orgSubType.toLowerCase()}`;
    }
  } else {
    paragraph = 'is an organization';
  }

  // Founded year
  if (foundedYear) {
    paragraph += ` founded in ${foundedYear}`;
  }

  // Country of operation
  if (country) {
    paragraph += `${foundedYear ? ',' : ''} based in ${country}`;
  }

  // Ownership structure
  if (ownership) {
    paragraph += `, operating as a ${ownership.toLowerCase()} entity`;
  }

  paragraph += '.';

  // Status - brief
  if (status) {
    paragraph += ` Status: ${status}.`;
  }

  // Minimal facts for display - only essential items (removed Parent, Location, Address, Contact)
  const facts = [
    { label: 'Type', value: orgType + (orgSubType && orgSubType !== 'Global Ultimate' ? ` (${orgSubType})` : '') },
    { label: 'Country', value: country },
    { label: 'Ownership', value: ownership },
    { label: 'Founded', value: foundedYear },
    { label: 'Status', value: status },
  ].filter(f => f.value);

  return {
    type: 'organization',
    imageUrl: null,
    paragraph: paragraph || 'An organizational entity.',
    facts: facts.slice(0, 4), // Only show up to 4 facts
    // Remove manufactures and partnerOf for minimal view
    manufactures: [],
    partnerOf: [],
    tags: [], // No tags for minimal view
  };
};

// Generate Wikipedia-style paragraph for Event
const parseEventData = (data) => {
  const event = data?.event || data;
  if (!event) return null;

  const description = event.description || '';
  const category = event.event_category || '';
  const subType = event.event_sub_type || '';
  const scale = event.event_scale || '';
  const significance = event.event_significance || '';
  const targetSector = event.targets_target_sector || '';
  const targetSubSector = event.targets_target_sub_sector || '';
  const targetEnvironment = event.event_target_environment || '';
  const attackVector = event.attack_vector || event.event_attack_method || '';
  const outcome = event.event_outcome || event.outcome || '';
  const casualties = event.casualties || event.event_casualties || '';

  const startDate = event.start_date ? new Date(event.start_date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : '';
  const endDate = event.end_date ? new Date(event.end_date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : '';
  const country = data?.primary_country || event.country || '';
  const location = event.location || event.event_location || '';

  // Actors and equipment
  const actors = data?.actors || [];
  const relatedEquipment = data?.related_equipment || [];

  // Build comprehensive Wikipedia-style paragraph
  let paragraph = '';

  if (description) {
    // Use first 220 chars of description for better context
    paragraph = description.length > 220 ? description.substring(0, 220) + '...' : description;
  } else {
    // Construct paragraph from available fields
    if (subType && category) {
      paragraph = `was a ${subType.toLowerCase()} incident classified as ${category.toLowerCase()}`;
    } else if (subType || category) {
      paragraph = `was a ${(subType || category).toLowerCase()} event`;
    } else {
      paragraph = 'was a security incident';
    }

    // Date information
    if (startDate) {
      paragraph += ` that occurred on ${startDate}`;
      if (endDate && endDate !== startDate) {
        paragraph += ` through ${endDate}`;
      }
    }

    // Location information
    if (country) {
      paragraph += ` in ${country}`;
    }
    if (location && location !== country) {
      paragraph += ` (${location})`;
    }
    paragraph += '.';

    // Target information with environment
    if (targetSector) {
      paragraph += ` The event targeted ${targetSector.toLowerCase()}`;
      if (targetSubSector) {
        paragraph += ` (${targetSubSector.toLowerCase()})`;
      }
      if (targetEnvironment) {
        paragraph += ` in a ${targetEnvironment.toLowerCase()} environment`;
      }
      paragraph += '.';
    } else if (targetEnvironment) {
      paragraph += ` Occurred in a ${targetEnvironment.toLowerCase()} environment.`;
    }

    // Attack method
    if (attackVector) {
      paragraph += ` Attack method: ${attackVector.toLowerCase()}.`;
    }

    // Scale and significance
    if (scale || significance) {
      paragraph += ` Assessed as`;
      if (scale) {
        paragraph += ` ${scale.toLowerCase()} scale`;
      }
      if (significance) {
        paragraph += `${scale ? ' with' : ''} ${significance.toLowerCase()} significance`;
      }
      paragraph += '.';
    }

    // Outcome information
    if (outcome) {
      paragraph += ` Outcome: ${outcome.toLowerCase()}.`;
    }

    // Casualties if available
    if (casualties) {
      paragraph += ` Reported casualties: ${casualties}.`;
    }

    // Actors involved
    if (actors.length > 0) {
      const actorNames = actors.slice(0, 2).map(a => a.label).join(' and ');
      paragraph += ` Involved actors: ${actorNames}${actors.length > 2 ? ' and others' : ''}.`;
    }

    // Equipment used
    if (relatedEquipment.length > 0) {
      const equipNames = relatedEquipment.slice(0, 2).map(e => e.label).join(', ');
      paragraph += ` Weapons/platforms: ${equipNames}.`;
    }
  }

  // Comprehensive facts for display
  const facts = [
    { label: 'Category', value: category },
    { label: 'Type', value: subType },
    { label: 'Date', value: startDate + (endDate && endDate !== startDate ? ` - ${endDate}` : '') },
    { label: 'Location', value: location || country },
    { label: 'Target', value: targetSector + (targetSubSector ? ` / ${targetSubSector}` : '') },
    { label: 'Environment', value: targetEnvironment },
    { label: 'Scale', value: scale },
    { label: 'Significance', value: significance },
    { label: 'Outcome', value: outcome },
  ].filter(f => f.value);

  return {
    type: 'event',
    imageUrl: null,
    paragraph: paragraph || 'A security event.',
    facts: facts.slice(0, 6),
    actors: actors, // Actors array for display
    relatedEquipment: relatedEquipment, // Equipment array for display
    tags: [category, subType, significance, scale].filter(Boolean).slice(0, 4),
  };
};

// Generate Wikipedia-style paragraph for Installation - Minimal summary version
const parseInstallationData = (data) => {
  if (!data) return null;

  // Extract installation object from the data structure
  const installation = data?.installation || data;
  const locationData = data?.location || {};
  const militaryAffiliation = data?.military_affiliation || {};

  // Installation basic info
  const installationType = installation?.installation_type || '';
  const installationSubType = installation?.installation_sub_type || '';
  const indicatedUse = installation?.indicated_use || '';
  const status = installation?.status || '';

  // Location info
  const countries = locationData?.countries || [];
  const country = countries[0] || '';

  // Military affiliation - just for operator info
  const operatedBy = militaryAffiliation?.operated_by || [];

  // Build location string
  let location = countries.length > 0 ? countries.join(', ') : '';

  // Build minimal Wikipedia-style paragraph - just essential info
  let paragraph = '';

  // Opening classification
  if (installationType) {
    paragraph = `is a ${installationType.toLowerCase()}`;
    if (installationSubType) {
      paragraph += ` ${installationSubType.toLowerCase()}`;
    }
  } else {
    paragraph = 'is a military installation';
  }

  // Indicated use
  if (indicatedUse) {
    paragraph += ` for ${indicatedUse.toLowerCase()} use`;
  }

  // Location information
  if (location) {
    paragraph += ` located in ${location}`;
  }

  paragraph += '.';

  // Operators - brief mention only
  if (operatedBy.length > 0) {
    const operatorNames = operatedBy.map(op => op.name).filter(Boolean).slice(0, 1).join('');
    if (operatorNames) {
      paragraph += ` Operated by ${operatorNames}.`;
    }
  }

  // Status - brief
  if (status) {
    paragraph += ` Status: ${status}.`;
  }

  // Minimal facts for display - only essential 3-4 items
  const facts = [
    { label: 'Type', value: installationType + (installationSubType ? ` ${installationSubType}` : '') },
    { label: 'Country', value: country },
    { label: 'Use', value: indicatedUse },
    { label: 'Status', value: status },
  ].filter(f => f.value);

  return {
    type: 'installation',
    imageUrl: null,
    paragraph: paragraph || 'A military installation.',
    facts: facts.slice(0, 4), // Only show up to 4 facts
    // Remove relatedUnits and relatedEquipment for minimal view
    relatedUnits: [],
    relatedEquipment: [],
    tags: [], // No tags for minimal view
  };
};

// Modern Wikipedia-style Tooltip Content
const TooltipContent = memo(({ content, entityName, entityType, onClose, colors }) => {
  if (!content) return null;

  const category = getEntityCategory(entityType);
  const isEquipment = category === 'equipment';
  const isMilitary = category === 'military';
  const isEvent = category === 'event';
  const isInstallation = category === 'installation';
  const accentColor = colors?.primary || '#3b82f6';
  const darkColor = colors?.dark || '#1e40af';

  // Determine width based on entity type
  const getWidth = () => {
    if (isEquipment) return 420;
    if (isMilitary) return 440;
    if (isEvent) return 420;
    if (isInstallation) return 420;
    return 380;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: getWidth(),
        overflow: 'hidden',
        borderRadius: '14px',
        backgroundColor: '#ffffff',
        boxShadow: `
          0 4px 6px -1px rgba(0, 0, 0, 0.08),
          0 10px 20px -5px rgba(0, 0, 0, 0.1),
          0 25px 50px -12px rgba(0, 0, 0, 0.15),
          0 0 0 1px ${accentColor}20
        `,
        position: 'relative',
        zIndex: 9999,
      }}
    >
      {/* Top accent line */}
      <Box
        sx={{
          height: 3,
          background: `linear-gradient(90deg, ${accentColor}, ${darkColor})`,
        }}
      />

      {/* Header - Highlighted Entity Name */}
      <Box
        sx={{
          px: 2,
          py: 1.25,
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          background: `linear-gradient(135deg, ${accentColor}08 0%, transparent 100%)`,
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: '10px',
            background: `linear-gradient(135deg, ${accentColor} 0%, ${darkColor} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            flexShrink: 0,
            boxShadow: `0 3px 10px ${accentColor}50`,
          }}
        >
          {getEntityIcon(category, entityType)}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: '-0.01em',
            }}
          >
            {entityName}
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              mt: 0.5,
              px: 0.75,
              py: 0.2,
              borderRadius: '4px',
              backgroundColor: `${accentColor}15`,
              border: `1px solid ${accentColor}25`,
            }}
          >
            <Box
              sx={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                backgroundColor: accentColor,
              }}
            />
            <Typography
              sx={{
                fontSize: '0.6rem',
                color: accentColor,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {entityType}
            </Typography>
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            width: 26,
            height: 26,
            color: '#94a3b8',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: '#f1f5f9',
              color: '#64748b',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>

      {/* Image Section for Equipment */}
      {content.imageUrl && (
        <Box
          sx={{
            width: '100%',
            height: 120,
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#f8fafc',
          }}
        >
          <Box
            component="img"
            src={content.imageUrl}
            alt={entityName}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              e.target.parentElement.style.display = 'none';
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 40,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.4))',
            }}
          />
        </Box>
      )}

      {/* Wikipedia-style Paragraph */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography
          sx={{
            fontSize: '0.85rem',
            lineHeight: 1.75,
            color: '#334155',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            textAlign: 'justify',
          }}
        >
          <Box
            component="span"
            sx={{
              fontWeight: 700,
              color: '#0f172a',
            }}
          >
            {entityName}
          </Box>
          {' '}
          {content.paragraph}
        </Typography>
      </Box>

      {/* Facts Section - Minimal inline style like Wikipedia */}
      {content.facts?.length > 0 && (
        <Box
          sx={{
            px: 2,
            pb: 1.25,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5,
            borderTop: '1px solid #f0f0f0',
            pt: 1,
          }}
        >
          {content.facts.map((fact, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.4,
                borderRadius: '6px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e5e7eb',
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  color: '#64748b',
                }}
              >
                {fact.label}:
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#1e293b',
                }}
              >
                {fact.value}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Military Equipment Section - for Military Groups */}
      {content.equipment?.length > 0 && (
        <Box
          sx={{
            px: 2,
            pb: 1.25,
          }}
        >
          {/* Section Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              mb: 0.75,
              pb: 0.5,
              borderTop: '1px solid #f0f0f0',
              pt: 1,
            }}
          >
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: '4px',
                background: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FlightIcon sx={{ fontSize: 11, color: '#fff' }} />
            </Box>
            <Typography
              sx={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#0369a1',
                letterSpacing: '0.02em',
              }}
            >
              Military Equipment
            </Typography>
            <Box
              sx={{
                ml: 'auto',
                px: 0.75,
                py: 0.2,
                borderRadius: '10px',
                backgroundColor: '#e0f2fe',
                border: '1px solid #7dd3fc',
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: '#0369a1',
                }}
              >
                {content.equipment.length}
              </Typography>
            </Box>
          </Box>

          {/* Equipment List - Informative only, no click */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
            }}
          >
            {content.equipment.slice(0, 3).map((equip, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 1,
                  py: 0.4,
                  borderRadius: '6px',
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#0369a1',
                  }}
                >
                  {equip.label}
                </Typography>
              </Box>
            ))}
            {content.equipment.length > 3 && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 1,
                  py: 0.4,
                  borderRadius: '6px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    color: '#64748b',
                  }}
                >
                  +{content.equipment.length - 3} more
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Manufactures Section - for Organizations */}
      {content.manufactures?.length > 0 && (
        <Box
          sx={{
            px: 2,
            pb: 1.25,
          }}
        >
          {/* Section Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              mb: 0.75,
              pb: 0.5,
              borderTop: '1px solid #f0f0f0',
              pt: 1,
            }}
          >
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: '4px',
                background: 'linear-gradient(135deg, #5D87FF 0%, #7c9eff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PrecisionManufacturingIcon sx={{ fontSize: 11, color: '#fff' }} />
            </Box>
            <Typography
              sx={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#5D87FF',
                letterSpacing: '0.02em',
              }}
            >
              Manufactures
            </Typography>
            <Box
              sx={{
                ml: 'auto',
                px: 0.75,
                py: 0.2,
                borderRadius: '10px',
                backgroundColor: '#e8efff',
                border: '1px solid #a3bfff',
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: '#5D87FF',
                }}
              >
                {content.manufactures.length}
              </Typography>
            </Box>
          </Box>

          {/* Manufactures List - Informative only */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
            }}
          >
            {content.manufactures.slice(0, 4).map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 1,
                  py: 0.4,
                  borderRadius: '6px',
                  backgroundColor: '#f0f5ff',
                  border: '1px solid #c7d7ff',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#4a73e8',
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            ))}
            {content.manufactures.length > 4 && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 1,
                  py: 0.4,
                  borderRadius: '6px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    color: '#64748b',
                  }}
                >
                  +{content.manufactures.length - 4} more
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Event Actors Section - for Events */}
      {content.actors?.length > 0 && (
        <Box
          sx={{
            px: 2,
            pb: 1.25,
          }}
        >
          {/* Section Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              mb: 0.75,
              pb: 0.5,
              borderTop: '1px solid #f0f0f0',
              pt: 1,
            }}
          >
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: '4px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <GroupsIcon sx={{ fontSize: 11, color: '#fff' }} />
            </Box>
            <Typography
              sx={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#7c3aed',
                letterSpacing: '0.02em',
              }}
            >
              Involved Actors
            </Typography>
            <Box
              sx={{
                ml: 'auto',
                px: 0.75,
                py: 0.2,
                borderRadius: '10px',
                backgroundColor: '#f3e8ff',
                border: '1px solid #d8b4fe',
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: '#7c3aed',
                }}
              >
                {content.actors.length}
              </Typography>
            </Box>
          </Box>

          {/* Actors List */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            {content.actors.slice(0, 4).map((actor, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1,
                  py: 0.5,
                  borderRadius: '6px',
                  backgroundColor: actor.role?.toLowerCase().includes('active') ? '#fef2f2' : '#f0fdf4',
                  border: `1px solid ${actor.role?.toLowerCase().includes('active') ? '#fecaca' : '#bbf7d0'}`,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: actor.role?.toLowerCase().includes('active') ? '#ef4444' : '#22c55e',
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#1e293b',
                    flex: 1,
                  }}
                >
                  {actor.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.6rem',
                    fontWeight: 500,
                    color: '#64748b',
                    textTransform: 'capitalize',
                  }}
                >
                  {actor.role || actor.type}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Related Equipment Section - for Events and Installations */}
      {content.relatedEquipment?.length > 0 && (
        <Box
          sx={{
            px: 2,
            pb: 1.25,
          }}
        >
          {/* Section Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              mb: 0.75,
              pb: 0.5,
              borderTop: '1px solid #f0f0f0',
              pt: 1,
            }}
          >
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: '4px',
                background: isInstallation
                  ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)'
                  : 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isInstallation
                ? <FlightIcon sx={{ fontSize: 11, color: '#fff' }} />
                : <WarningIcon sx={{ fontSize: 11, color: '#fff' }} />
              }
            </Box>
            <Typography
              sx={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: isInstallation ? '#0284c7' : '#ea580c',
                letterSpacing: '0.02em',
              }}
            >
              {isInstallation ? 'Equipment at Base' : 'Weapons/Platforms Used'}
            </Typography>
            <Box
              sx={{
                ml: 'auto',
                px: 0.75,
                py: 0.2,
                borderRadius: '10px',
                backgroundColor: isInstallation ? '#e0f2fe' : '#fff7ed',
                border: `1px solid ${isInstallation ? '#7dd3fc' : '#fed7aa'}`,
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: isInstallation ? '#0284c7' : '#ea580c',
                }}
              >
                {content.relatedEquipment.length}
              </Typography>
            </Box>
          </Box>

          {/* Equipment List */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
            }}
          >
            {content.relatedEquipment.slice(0, 4).map((equip, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1,
                  py: 0.4,
                  borderRadius: '6px',
                  backgroundColor: isInstallation ? '#f0f9ff' : '#fff7ed',
                  border: `1px solid ${isInstallation ? '#bae6fd' : '#fed7aa'}`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: isInstallation ? '#0369a1' : '#c2410c',
                  }}
                >
                  {equip.label}
                </Typography>
              </Box>
            ))}
            {content.relatedEquipment.length > 4 && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 1,
                  py: 0.4,
                  borderRadius: '6px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    color: '#64748b',
                  }}
                >
                  +{content.relatedEquipment.length - 4} more
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Installation Related Units Section - for Installations */}
      {content.relatedUnits?.length > 0 && (
        <Box
          sx={{
            px: 2,
            pb: 1.25,
          }}
        >
          {/* Section Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              mb: 0.75,
              pb: 0.5,
              borderTop: '1px solid #f0f0f0',
              pt: 1,
            }}
          >
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: '4px',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MilitaryTechIcon sx={{ fontSize: 11, color: '#fff' }} />
            </Box>
            <Typography
              sx={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#059669',
                letterSpacing: '0.02em',
              }}
            >
              Units at Installation
            </Typography>
            <Box
              sx={{
                ml: 'auto',
                px: 0.75,
                py: 0.2,
                borderRadius: '10px',
                backgroundColor: '#d1fae5',
                border: '1px solid #6ee7b7',
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: '#059669',
                }}
              >
                {content.relatedUnits.length}
              </Typography>
            </Box>
          </Box>

          {/* Units List */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
            }}
          >
            {content.relatedUnits.slice(0, 4).map((unit, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 1,
                  py: 0.4,
                  borderRadius: '6px',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#047857',
                  }}
                >
                  {unit.label || unit.name}
                </Typography>
              </Box>
            ))}
            {content.relatedUnits.length > 4 && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 1,
                  py: 0.4,
                  borderRadius: '6px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    color: '#64748b',
                  }}
                >
                  +{content.relatedUnits.length - 4} more
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Tags Section - for Equipment */}
      {!content.facts && content.tags?.length > 0 && (
        <Box
          sx={{
            px: 2,
            pb: 1.5,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5,
          }}
        >
          {content.tags.map((tag, idx) => (
            <Box
              key={idx}
              sx={{
                px: 1,
                py: 0.35,
                borderRadius: '12px',
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.65rem',
                  fontWeight: 500,
                  color: '#475569',
                }}
              >
                {tag}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Footer */}
      <Box
        sx={{
          px: 2,
          py: 0.6,
          backgroundColor: '#fafbfc',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
        }}
      >
        <Box
          sx={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            backgroundColor: accentColor,
            opacity: 0.6,
          }}
        />
        <Typography
          sx={{
            fontSize: '0.55rem',
            color: '#94a3b8',
            fontWeight: 500,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Quick Preview
        </Typography>
        <Box
          sx={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            backgroundColor: accentColor,
            opacity: 0.6,
          }}
        />
      </Box>
    </Paper>
  );
});

// Loading Component
const LoadingContent = ({ colors, entityCategory = 'equipment' }) => {
  const accentColor = colors?.primary || '#3b82f6';
  const getWidth = () => {
    if (entityCategory === 'equipment') return 420;
    if (entityCategory === 'military') return 440;
    if (entityCategory === 'event') return 420;
    if (entityCategory === 'installation') return 420;
    return 380;
  };
  return (
    <Paper
      elevation={0}
      sx={{
        width: getWidth(),
        height: 130,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '14px',
        backgroundColor: '#ffffff',
        boxShadow: `
          0 4px 6px -1px rgba(0, 0, 0, 0.08),
          0 10px 20px -5px rgba(0, 0, 0, 0.1),
          0 0 0 1px ${accentColor}20
        `,
        zIndex: 9999,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)`,
        }}
      />
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress
          size={30}
          thickness={4}
          sx={{ color: accentColor }}
        />
        <Typography
          sx={{
            mt: 1,
            fontSize: '0.72rem',
            color: '#64748b',
            fontWeight: 500,
          }}
        >
          Loading...
        </Typography>
      </Box>
    </Paper>
  );
};

// Controlled WikipediaPopperTooltip for external anchoring (e.g., content hover)
export function WikipediaPopperTooltip({
  open,
  anchorEl,
  entityName,
  entityType,
  colors,
  onClose,
  onMouseEnter,
  onMouseLeave,
}) {
  const tooltipRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);
  const prevEntityRef = useRef(null);

  // Fetch entity data when opened with a new entity
  useEffect(() => {
    if (open && entityName && entityType) {
      const entityKey = `${entityName}-${entityType}`;
      if (prevEntityRef.current !== entityKey) {
        prevEntityRef.current = entityKey;
        setContent(null);
        setLoading(true);

        fetchEntityData(entityName, entityType)
          .then((result) => {
            if (result) {
              let parsedContent = null;
              switch (result.category) {
                case 'equipment':
                  parsedContent = parseEquipmentData(result.data, result.images);
                  break;
                case 'military':
                  parsedContent = parseMilitaryData(result.data);
                  break;
                case 'organization':
                  parsedContent = parseOrganizationData(result.data);
                  break;
                case 'event':
                  parsedContent = parseEventData(result.data);
                  break;
                case 'installation':
                  parsedContent = parseInstallationData(result.data);
                  break;
              }
              setContent(parsedContent);
            }
          })
          .catch((error) => {
            console.error('Error loading tooltip content:', error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [open, entityName, entityType]);

  // Reset when closed
  useEffect(() => {
    if (!open) {
      prevEntityRef.current = null;
    }
  }, [open]);

  if (!anchorEl) return null;

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      transition
      modifiers={[
        { name: 'offset', options: { offset: [0, 8] } },
        { name: 'preventOverflow', options: { boundary: 'viewport', padding: 16 } },
        { name: 'flip', options: { fallbackPlacements: ['top-start', 'right', 'left'] } },
      ]}
      sx={{ zIndex: 99999 }}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={150}>
          <Box
            ref={tooltipRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            sx={{ position: 'relative', zIndex: 99999 }}
          >
            {loading ? (
              <LoadingContent colors={colors} entityCategory={getEntityCategory(entityType)} />
            ) : (
              <TooltipContent
                content={content}
                entityName={entityName}
                entityType={entityType}
                onClose={onClose}
                colors={colors}
              />
            )}
          </Box>
        </Fade>
      )}
    </Popper>
  );
}

// Main WikipediaTooltip component
function WikipediaTooltip({ children, entityName, entityType, colors }) {
  const anchorRef = useRef(null);
  const tooltipRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    hoverTimeoutRef.current = setTimeout(async () => {
      setOpen(true);
      if (!content) {
        setLoading(true);
        try {
          const result = await fetchEntityData(entityName, entityType);
          if (result) {
            let parsedContent = null;
            switch (result.category) {
              case 'equipment':
                parsedContent = parseEquipmentData(result.data, result.images);
                break;
              case 'military':
                parsedContent = parseMilitaryData(result.data);
                break;
              case 'organization':
                parsedContent = parseOrganizationData(result.data);
                break;
              case 'event':
                parsedContent = parseEventData(result.data);
                break;
              case 'installation':
                parsedContent = parseInstallationData(result.data);
                break;
            }
            setContent(parsedContent);
          }
        } catch (error) {
          console.error('Error loading tooltip content:', error);
        } finally {
          setLoading(false);
        }
      }
    }, 350);
  }, [entityName, entityType, content]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  }, []);

  const handleTooltipMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  return (
    <>
      <Box
        ref={anchorRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{ display: 'block', cursor: 'pointer' }}
      >
        {children}
      </Box>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="left-start"
        transition
        modifiers={[
          { name: 'offset', options: { offset: [0, 12] } },
          { name: 'preventOverflow', options: { boundary: 'viewport', padding: 16 } },
          { name: 'flip', options: { fallbackPlacements: ['right-start', 'bottom', 'top'] } },
        ]}
        sx={{ zIndex: 99999 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={150}>
            <Box
              ref={tooltipRef}
              onMouseEnter={handleTooltipMouseEnter}
              onMouseLeave={handleMouseLeave}
              sx={{ position: 'relative', zIndex: 99999 }}
            >
              {loading ? (
                <LoadingContent colors={colors} entityCategory={getEntityCategory(entityType)} />
              ) : (
                <TooltipContent
                  content={content}
                  entityName={entityName}
                  entityType={entityType}
                  onClose={handleClose}
                  colors={colors}
                />
              )}
            </Box>
          </Fade>
        )}
      </Popper>
    </>
  );
}

export default memo(WikipediaTooltip);
