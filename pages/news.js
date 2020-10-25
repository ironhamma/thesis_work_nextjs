import Sidebar from "../components/Sidebar/index";
import { connectToDatabase } from "../util/mongodb";
import { withIronSession } from "next-iron-session";
import { useRouter } from 'next/router';

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const { db } = await connectToDatabase();
    const news = await db.collection("news").find({}).toArray();

    const user = req.session.get("user");

    return {
      props: { news: JSON.stringify(news), user: JSON.stringify(user) },
    };
  },
  {
    cookieName: "USERCOOKIE",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
    password: process.env.APPLICATION_SECRET,
  }
);

function NewsPage(props) {
  const newsArray = JSON.parse(props.news);
  const user = JSON.parse(props.user);
  const router = useRouter();

  const handleDelete = async (e, newsId) => {
    e.preventDefault();
    const response = await fetch("/api/news/deleteNews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({newsId: newsId})
    });

    if(response.ok){
      return router.push("/news");
    }
  }

  console.log(newsArray);

  return (
    <div className="pageContainer">
      <Sidebar />
      <div className="mainSection">
        <h1 className="pageTitle">Hírek</h1>
        <div className="newsFlex">
          {newsArray.map((e, index) => (
            <div className="newsItem" key={index}>
              <h2 className="newsItem__title">{e.heading}</h2>
                {user.isAdmin ? 
                (
                <div>
                  <button onClick={(event) => handleDelete(event, e._id)}>Delete</button>
                </div>
                ) : (<div></div>)}
              <p className="newsItem__text">{e.text}</p>
              <p className="newsItem__date">{e.created_at}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewsPage;
