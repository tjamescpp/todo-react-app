import Button from './Button';
import Icon from './Icon';

export default function ProjectHeader({
    projectName,
    taskCount,
    iconSrc,
    onClick,
}) {
    return (
        <>
            <div id="projectHeader">
                {iconSrc && (
                    <Button className="listExpandCollapse" onClick={onClick}>
                        <Icon
                            className="contentIcons"
                            src={iconSrc}
                            alt="Expand-Collapse"
                            id="expandCollapseIcon"
                        ></Icon>
                    </Button>
                )}
                <p id="projectTitle">{projectName}</p>
                <p id="projectTaskCount">{taskCount}</p>
            </div>
        </>
    );
}
