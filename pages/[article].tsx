import path from "path";
import { GetStaticProps, GetStaticPaths } from "next";
import fs from "fs";
import matter from "gray-matter";
import remarkToc from "remark-toc";
import remarkSlug from "remark-slug";
import ReactMarkdown from "react-markdown";

interface ArticlesPageProps {
  content: string;
  frontMatter: {
    date: string;
    mainTitle: string;
    shortTitle: string;
  };
}

const ArticlesPage: React.FC<ArticlesPageProps> = ({ content, frontMatter }) => {
  return (
    <>
      
        <main>
            <ReactMarkdown
              remarkPlugins={[
                [remarkToc, { heading: "Innhold", maxDepth: 3, tight: true }],
                remarkSlug,
              ]}
            >
              {content}
            </ReactMarkdown>
        </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const articlesDir = path.join(process.cwd(), "_posts/articles");
  const fullPath = path.join(articlesDir, `${context.params!.articles}.md`);
  const file = fs.readFileSync(fullPath);
  const { content, data } = matter(file);

  return {
    props: { content, frontMatter: { ...data } },
  };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  const articlesDir = path.join(process.cwd(), "_posts/articles");
  const paths = fs
    .readdirSync(articlesDir)
    .map((Info) => ({ params: { articles: Info.replace(/.md?$/, "") } }));

  return {
    paths,
    fallback: false,
  };
};

export default ArticlesPage;