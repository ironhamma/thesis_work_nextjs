import Sidebar from "../components/Sidebar/index";
import { connectToDatabase } from "../util/mongodb";
import { withIronSession } from "next-iron-session";
import { useRouter } from "next/router";
import Button from "../components/Button";
import Input from "../components/Input";
import NewsItem from "../components/NewsItem";
import PageTitle from "../components/PageTitle";
import styles from "./NewsPage.module.css";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import Spacer from "../components/Spacer";  

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
  const [newsAddOpen, setNewsAddOpen] = useState(false);

  const handleDelete = async (e, newsId) => {
    e.preventDefault();
    const response = await fetch("/api/news/deleteNews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newsId: newsId }),
    });

    if (response.ok) {
      return router.push("/news");
    }
  };

  const { handleSubmit, errors, reset, control } = useForm({
    defaultValues: {
      newsText: "",
      newsHeading: "",
    },
  });
  const onNewsSubmit = async (result) => {
    reset();
    setNewsAddOpen(false);
    const response = await fetch("/api/news/addNews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newsText: result.newsText,
        newsHeading: result.newsHeading,
      }),
    });

    if (response.ok) {
      return router.push("/news");
    }
  };

  return (
    <div>
      <Sidebar user={user} />
      <div className={styles.root}>
        <PageTitle>Hírek</PageTitle>
        <div className="newsFlex">
          {newsArray.map((e, index) => (
            <NewsItem
              newsElement={e}
              isAdmin={user.userType === 1}
              index={index}
              onDelete={handleDelete}
            />
          ))}
        </div>
        {user.userType === 1 && (
          <>
            {newsAddOpen && (
              <form>
                <Controller
                  name="newsHeading"
                  title="Hír címe"
                  control={control}
                  as={Input}
                />
                <Controller
                  name="newsText"
                  title="Hír szövege"
                  control={control}
                  as={Input}
                />
              </form>
            )}
            {newsAddOpen ? (
              <>
                <Button capital onClick={handleSubmit(onNewsSubmit)}>
                  Submit news
                </Button>
                <Spacer x={1} />
                <Button capital onClick={() => setNewsAddOpen(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button capital onClick={() => setNewsAddOpen(true)}>
                Add news
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default NewsPage;
