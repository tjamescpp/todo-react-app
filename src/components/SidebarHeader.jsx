import Icon from './Icon';

export default function SidebarHeader({ user }) {
    return (
        <div id="sidebarHeader">
            <Icon src={user.profilePic} alt={'profilePic'} id={'profilePic'} />
            <p>{user.firstName}</p>
            <Icon
                src={'/icons/bell-outline.svg'}
                alt={'notifications'}
                id={'notificationIcon'}
                className={'sidebarIcons'}
            />
        </div>
    );
}
