import Image from "next/image";
import LogoDisplay from "./components/LogoDisplay";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between text-black">
      <header className="w-full flex flex-col md:flex-row justify-between  md:px-24">
        <div className="flex items-center justify-center md:justify-start ">
          <LogoDisplay />
        </div>
        <nav className="flex justify-center md:justify-end mt-4 md:mt-0">
          <ul className="flex p-0 m-0 list-none gap-20 md:gap-10 items-center">
            <li>
              <a href="/login" className="text-black">
                Entrar
              </a>
            </li>
            <li>
              <a
                href="/cadastrar"
                className="bg-yellow-500 text-black py-2 px-4 rounded-md shadow-sm hover:bg-yellow-400 focus:ring-indigo-500"
              >
                Cadastrar
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex flex-col md:flex-row justify-start align-middle items-center px-5 md:px-40 py-12">
        <div className="w-full md:w-1/2 gap-10   md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold mb-10">
            Bem-vindo à <span className="text-yellow-500">Taxi Plus</span>
          </h1>

          <p className="max-w-xl text-lg mb-6">
            Oferecemos corridas rápidas, seguras e confiáveis, sempre que você
            precisar. Seja para o trabalho, lazer ou uma viagem urgente, nossa
            equipe de motoristas experientes está pronta para te levar onde você
            precisa, com conforto e pontualidade.
          </p>

          <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 mt-4">
            <a
              href="/cadastro"
              className="bg-yellow-400 text-black py-3 px-6 rounded-lg shadow-md text-center hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-offset-2"
            >
              Solicite seu táxi
            </a>
          </div>
        </div>
        <div className="hidden md:w-1/2 md:block">
          <Image
            alt="logo"
            width={800}
            height={800}
            src="/assets/image/taxi_vetor.jpg"
          />
        </div>
      </main>

      <footer className="  py-6">
        <div className="flex justify-center">
          <p className="text-sm text-black mt-4">
            © 2024 <span className="text-yellow-500">Taxi Plus</span> Todos os
            direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
