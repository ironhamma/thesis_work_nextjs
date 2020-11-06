import styles from './UserList.module.css';
import UserListItem from "../../components/UserListItem";

function UserList({onChildrenClick, users, currentUser}){
    return (
        <ul className={styles.root}>
            {users.map((e, index) => (
                <UserListItem currentUser={currentUser} user={e} onClick={onChildrenClick} index={index} />
            ))}
        </ul>
    );
}

export default UserList;