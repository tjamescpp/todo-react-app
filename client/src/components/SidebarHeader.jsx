import Icon from './Icon';

export default function SidebarHeader({ user }) {
    return (
        <div id="sidebarHeader">
            <Icon
                src={
                    user.picture
                        ? user.picture
                        : '/icons/account-circle-outline.svg'
                }
                alt={'profilePic'}
                id={'profilePic'}
            />
            <p>{user?.firstName}</p>
        </div>
    );
}
