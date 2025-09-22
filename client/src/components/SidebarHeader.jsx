import Icon from './Icon';

export default function SidebarHeader({ user }) {
    return (
        <div id="sidebarHeader">
            <Icon
                src={
                    '/images/vecteezy_young-boy-face-illustration-design_9280306.svg'
                }
                alt={'profilePic'}
                id={'profilePic'}
            />
            <p>{user?.firstName || 'Loading...'}</p>
        </div>
    );
}
