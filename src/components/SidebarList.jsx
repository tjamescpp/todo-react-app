import Button from './Button';
import Icon from './Icon';

export default function SidebarList({
    listId,
    buttons,
    buttonClass = 'sidebarBtn',
    buttonType = 'button',
    iconClass = 'sidebarIcons',
}) {
    return (
        <ul id={listId}>
            {buttons.map((button) => {
                return (
                    <li key={button.id}>
                        <Button
                            className={buttonClass}
                            type={buttonType}
                            id={button.id}
                        >
                            <Icon
                                className={iconClass}
                                src={button.src}
                                alt={button.name}
                            />
                            <p>{button.name}</p>
                        </Button>
                    </li>
                );
            })}
        </ul>
    );
}
