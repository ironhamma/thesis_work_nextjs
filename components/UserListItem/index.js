import styles from "./UserListItem.module.css";
import cn from "clsx";
import Button from "../Button";

function UserListItem({ onClick, user, currentUser, index }) {
  const permissionText =
    currentUser === user.userName ? (
      <b>Admin</b>
    ) : user.isAdmin ? (
        <div className={styles.adminBox}>
            <b>Admin</b>
            <Button onClick={() => onClick(user.userName)}>Admin jog elvétele</Button>
        </div>
    ) : (
      <Button onClick={() => onClick(user.userName)}>Admin jog megadása</Button>
    );
    console.log(user);
  return (
    <li className={styles.root} key={index}>
      <div>
            <div className={styles.name}>{user.userName}</div>
            <div className={styles.subDataContainer}>
                <div className={styles.subData}>Vezetéknév: <span>{user.userSecondName}</span></div>
                <div className={styles.subData}>Keresztnév: <span>{user.userFirstName}</span></div>
                <div className={styles.subData}>Email: <span>{user.userMail}</span></div>
                <div className={styles.subData}>Tel.: <span>{user.userTel}</span></div>
                <div className={styles.subData}>Koli: <span>{user.userDorm}</span></div>
                <div className={styles.subData}>Szoba: <span>{user.userRoom}</span></div>
                <div className={styles.subData}>Kar: <span>{user.userInstitute}</span></div>
                <div className={styles.subData}>Foglalási azonosító: <span>{user.reserveId}</span></div>
            </div>
      </div>
      {permissionText}
    </li>
  );
}

export default UserListItem;
