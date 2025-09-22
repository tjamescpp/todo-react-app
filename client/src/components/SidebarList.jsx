import Button from './Button';
import Icon from './Icon';

export default function SidebarList({ buttons }) {
    return (
        <ul id={'sidebarList'}>
            {buttons.map((button) => {
                return (
                    <li key={button.id}>
                        <Button
                            className={'sidebarBtn'}
                            type={'button'}
                            id={button.id}
                            onClick={button.onClick}
                        >
                            <Icon
                                className={'sidebarIcons'}
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
