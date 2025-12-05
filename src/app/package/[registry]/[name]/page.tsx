import { Metadata } from "next";
import { generatePackageMetadata } from "@/lib/metadata";

interface PackagePageProps {
  params: {
    registry: string;
    name: string;
  };
}

// Gerar metadados dinâmicos para cada página de pacote
export async function generateMetadata({
  params,
}: PackagePageProps): Promise<Metadata> {
  const { registry, name } = params;

  // Decodificar o nome do pacote caso tenha caracteres especiais
  const decodedName = decodeURIComponent(name);

  return generatePackageMetadata(decodedName, registry);
}

export default function PackagePage({ params }: PackagePageProps) {
  const { registry, name } = params;
  const decodedName = decodeURIComponent(name);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          Package Analysis: {decodedName}
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Registry: {registry.toUpperCase()}
        </p>

        {/* Aqui você pode adicionar o conteúdo da análise do pacote */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Package Information</h2>
          <p>
            Detailed analysis for {decodedName} from {registry} registry will be
            displayed here.
          </p>
        </div>
      </div>
    </div>
  );
}
