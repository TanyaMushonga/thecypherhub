import LatestSubscribers from "../../components/othercomponents/latestSubscribers";
import NewArticles from "../../components/othercomponents/newArticles";

export default function Home() {
  return (
    <main className="bg-primary h-[95vh] w-full py-10">
      <div className="px-5 md:px-10 flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/2">
          <h1 className="text-white font-semibold text-lg md:text-2xl">
            Latest articles
          </h1>
          <NewArticles />
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="text-white font-semibold text-lg md:text-2xl">
            Latest subscribers
          </h1>
          <LatestSubscribers />
        </div>
      </div>
    </main>
  );
}
