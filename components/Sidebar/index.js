import Link from "next/link";
import styles from  './Sidebar.module.css';
import { withIronSession } from 'next-iron-session';
import cn from 'clsx';
import { useRouter } from "next/router";


function Sidebar({user}) {
  const router = useRouter();

  const onLogout = async () => {
    const response = await fetch("/api/users/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    if (response.ok) {
      return router.push("/");
    }
  }

  return (
    <>
    {user && [1,2,3].includes(user.userType) &&
      <div className={cn(styles.sidebar, {[styles.superAdminSidebar]: user.userType === 1, [styles.adminSidebar]: user.userType === 2, [styles.openerSidebar]: user.userType === 3})}>
        <ul>
          <Link href="/admin/users">
            <a>
              <li>Felhasználók</li>
            </a>
          </Link>
          <Link href="/admin/reservations">
            <a>
              <li>Foglalások</li>
            </a>
          </Link>
        </ul>
      </div>
    }
      <div className={styles.sidebar}>
        <ul>
          <img src="./MMMK.png" alt="MMMK logo" />
          {
            user !== null && user !== undefined ?
            ( <>
                <Link href="/">
                <a>
                  <li>Híreink</li>
                </a>
                </Link>
                <Link href="/about">
                  <a>
                    <li>Rólunk</li>
                  </a>
                </Link>
                <Link href="/rules">
                  <a>
                    <li>Szabályzat</li>
                  </a>
                </Link>
                <Link href="/reserve">
                  <a>
                    <li>Foglalás</li>
                  </a>
                </Link>
                <Link href="/messages">
                  <a>
                    <li>Üzenetek</li>
                  </a>
                </Link>
                <Link href="/profile">
                  <a>
                    <li>Profilom</li>
                  </a>
                </Link>
                <Link href="/">
                  <a>
                    <li onClick={onLogout}>Kilépés</li>
                  </a>
                </Link>
            </>
            ) 
            : 
            (
              <>
                <Link href="/">
                <a>
                  <li>Híreink</li>
                </a>
                </Link>
                <Link href="/about">
                  <a>
                    <li>Rólunk</li>
                  </a>
                </Link>
                <Link href="/rules">
                  <a>
                    <li>Szabályzat</li>
                  </a>
                </Link>
                <Link href="/login">
                  <a>
                    <li>Belépés</li>
                  </a>
                </Link>
              </>
            )
          }
          
        </ul>
      </div>
    </>
  );
};

export default Sidebar;