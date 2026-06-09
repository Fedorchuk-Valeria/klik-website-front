import Footer from "@/src/components/ui/Footer/Footer";
import Header from "@/src/components/ui/Header/Header";

export default function NotFound() {
  return (
    <>
      <Header />

      <main>
        <section className="page-404">
          <div className="home-page__container">
            <h1>404</h1>
            <p>Страница не найдена</p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
