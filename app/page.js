import { redirect } from "next/navigation";
export default function Home() {
  redirect("/signin");
  return <div>hello</div>;
}
