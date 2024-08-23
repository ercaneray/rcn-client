import React from 'react';
import '../index.css';
const ChangeDescription = ({ action, changeDetails, preImageDetails, userName }) => {
    const getDescription = () => {
        let description = '';
        const entityName = changeDetails.name;
        const entityType = changeDetails.type || preImageDetails?.type || 'Unknown';

        switch (entityType) {
            case 'workers':
                switch (action) {
                    case 'insert':
                        description = `Worker ${entityName} added by ${userName}`;
                        break;
                    case 'delete':
                        description = `Worker ${entityName} deleted by ${userName}`;
                        break;
                    case 'update':
                        if (preImageDetails) {
                            description = `Worker ${preImageDetails.name} updated by ${changeDetails.user}`;
                        } else {
                            description = `Worker updated by ${userName}`;
                        }
                        break;
                    default:
                        description = `Unknown worker action by ${userName}`;
                }
                break;
            case 'warehouses':
                switch (action) {
                    case 'insert':
                        description = `Warehouse ${entityName} added by ${userName}`;
                        break;
                    case 'delete':
                        description = `Warehouse ${entityName} deleted by ${userName}`;
                        break;
                    case 'update':
                        if (preImageDetails) {
                            description = `Warehouse ${preImageDetails.name} updated by ${changeDetails.user}`;
                        } else {
                            description = `Warehouse updated by ${userName}`;
                        }
                        break;
                    default:
                        description = `Unknown warehouse action by ${userName}`;
                }
                break;
            case 'vehicles':
                switch (action) {
                    case 'insert':
                        description = `Vehicle ${entityName} added by ${userName}`;
                        break;
                    case 'delete':
                        description = `Vehicle ${entityName} deleted by ${userName}`;
                        break;
                    case 'update':
                        if (preImageDetails) {
                            description = `Vehicle ${preImageDetails.name} updated by ${changeDetails.user}`;
                        } else {
                            description = `Vehicle updated by ${userName}`;
                        }
                        break;
                    default:
                        description = `Unknown vehicle action by ${userName}`;
                }
                break;
            case 'stock':
                if (action === 'update') {
                    if (preImageDetails) {
                        description = `Stock updated for ${preImageDetails.name} by ${userName}`;
                    } else {
                        description = `Stock updated by ${userName}`;
                    }
                } else {
                    description = `Unknown stock action by ${userName}`;
                }
                break;
            default:
                description = `Unknown action by ${userName}`;
        }

        return description;
    };

    const getDescriptionClass = () => {
        switch (action) {
            case 'insert':
                return 'description-insert';
            case 'delete':
                return 'description-delete';
            case 'update':
                return 'description-update';
            default:
                return '';
        }
    };

    return <span className={getDescriptionClass()}>{getDescription()}</span>;
};

export default ChangeDescription;
