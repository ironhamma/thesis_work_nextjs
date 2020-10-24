import Link from "next/link";
export default function Sidebar() {
  return (
    <div className="sideBar">
      <ul>
        <img src="./MMMK.png" alt="MMMK logo" />
        <Link href="/news">
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
        <Link href="/">
          <a>
            <li>Kilépés</li>
          </a>
        </Link>
      </ul>
    </div>
  );
}
