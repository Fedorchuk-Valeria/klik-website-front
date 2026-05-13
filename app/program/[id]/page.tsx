import Breadcrumb from "@/src/components/ui/Breadcrumb/Breadcrumb";

type ProgramViewProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProgramViewPage({ params }: ProgramViewProps) {
  const { id } = await params;

  return (
    <section className="program-view">
      <div className="program-view__container">
        <div className="program-view__header">
          <Breadcrumb currentLabel="Программы по возрастам" />

          <h1 className="program-view__title">{id}</h1>
        </div>
      </div>
    </section>
  );
}
