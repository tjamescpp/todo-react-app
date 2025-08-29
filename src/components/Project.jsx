import Button from './Button';
import Icon from './Icon';
import { useState } from 'react';

const icons = {
    expand: '/icons/menu-down.svg',
    collapse: '/icons/menu-right.svg',
};

function ProjectHeader({ id, projectName, iconSrc, onClick }) {
    return (
        <div className="projectHeader" id={id}>
            <Button className="listExpandCollapse" onClick={onClick}>
                <Icon
                    className="contentIcons"
                    src={iconSrc}
                    alt="Expand-Collapse"
                    id="expandCollapseIcon"
                ></Icon>
            </Button>
            <p className="projectTitle">{projectName}</p>
        </div>
    );
}

export default function Project({ id, projectName }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="project" id={id}>
            <ProjectHeader
                id={'allHeader'}
                projectName={projectName}
                iconSrc={isExpanded ? icons.expand : icons.collapse}
                onClick={handleExpand}
            />
        </div>
    );
}
