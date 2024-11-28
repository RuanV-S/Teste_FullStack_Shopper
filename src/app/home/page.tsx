"use client";

import Button from "../components/Button";
import Input from "../components/Input";
import LogoDisplay from "../components/LogoDisplay";
import { SubmitHandler, useForm } from "react-hook-form";
import { validate as validateUUID } from "uuid";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import RatingStars from "../components/RatingStars";
import Cookies from "js-cookie";

interface FormData {
  origin: string;
  destination: string;
  customer_id: string;
  driver: string;
}

interface Driver {
  id: number;
  name: string;
  vehicle: string;
  value: number;
  description: string;
  review: Review;
}

interface RideData {
  destination: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  duration: string;
  options: Driver[];
  origin: {
    latitude: number;
    longitude: number;
  };
  routerResponse: {
    destination_addresses: Array<string>;
    origin_addresses: Array<string>;
  };
}

interface Review {
  rating: number;
  comment: string;
}

interface RideHistory {
  id: string;
  date: string;
  destination: string;
  distance: number;
  driver: {
    id: string;
    name: string;
  };
  origin: string;

  duration: string;
  value: string;
}

export default function Page() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const [rideData, setRideData] = useState<RideData | null>(null);
  const toast = useRef<Toast>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [drivers, setDrivers] = useState<Driver[] | null>();
  const [mapStatic, setMapStatic] = useState<string | null>(null);
  const [rideHistory, setRideHistory] = useState<RideHistory[] | null>(null);
  const userCookie = Cookies.get("user");

  useEffect(() => {
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        if (parsedUser.id) {
          setValue("customer_id", parsedUser.id);
        }
      } catch {
        setValue("customer_id", userCookie);
      }
    }
  }, [setValue, userCookie]);

  const handleSelectDriver = (driver: Driver) => {
    setSelectedDriver(driver);
  };

  const handleConfirmRide = async () => {
    if (!selectedDriver)
      return toast.current?.show({
        severity: "warn",
        summary: "Aviso",
        detail:
          "Por favor, selecione um motorista antes de confirmar a viagem.",
        life: 3000,
      });

    const response = await fetch("/api/ride/confirm", {
      method: "POST",
      body: JSON.stringify({
        customer_id: JSON.parse(userCookie!).id,
        origin: rideData?.routerResponse.origin_addresses[0],
        destination: rideData?.routerResponse.destination_addresses[0],
        distance: rideData?.distance,
        duration: rideData?.duration,
        driver: {
          id: selectedDriver.id,
          name: selectedDriver.name,
        },
        value: selectedDriver.value,
      }),
    });

    if (response.status === 200) {
      const responseDrivers = await fetch("/api/driver");
      const responseJson = await responseDrivers.json();

      setDrivers(responseJson);
      setShowHistory(true);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível confirmar a viagem.",
        life: 3000,
      });
    }
  };

  const onSubmit: SubmitHandler<FormData> = async ({
    customer_id,
    origin,
    destination,
  }) => {
    try {
      const response = await fetch("/api/ride/estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id,
          origin,
          destination,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();

        if (data.body.options.length === 0)
          return toast.current?.show({
            severity: "warn",
            summary: "Aviso",
            detail: "Não tem motorista disponiveis no momento para essa rota.",
            life: 3000,
          });

        const responseMap = await fetch("/api/map", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            origin: `${data.body.origin.latitude},${data.body.origin.longitude}`,
            destination: `${data.body.destination.latitude},${data.body.destination.longitude}`,
          }),
        });

        const mapStatic = await responseMap.json();
        setMapStatic(mapStatic.url);
        setRideData(data.body);
      } else {
        toast.current?.show({
          severity: "warn",
          summary: "Aviso",
          detail: "Não foi possível buscar a viagem.",
          life: 3000,
        });
      }
    } catch {
      toast.current?.show({
        severity: "warn",
        summary: "Aviso",
        detail: "Não foi possível buscar a viagem.",
        life: 3000,
      });
    }
  };

  if (showHistory) {
    const onSubmitFilter: SubmitHandler<FormData> = async (data) => {
      try {
        let url = `/api/ride/${data.customer_id}`;

        if (data.driver && data.driver !== "all") {
          url += `?driver_id=${data.driver}`;
        }

        const response = await fetch(url);

        if (response.status === 200) {
          const responseJson = await response.json();
          setRideHistory(responseJson.rides);
        } else if (response.status === 400) {
          toast.current?.show({
            severity: "warn",
            summary: "Aviso",
            detail: "Não tem corrida com esse motorista",
            life: 3000,
          });
        } else {
          toast.current?.show({
            severity: "warn",
            summary: "Aviso",
            detail: "Não foi possível buscar o histórico de viagens.",
            life: 3000,
          });
        }
      } catch {
        toast.current?.show({
          severity: "warn",
          summary: "Aviso",
          detail: "Não foi possível buscar o histórico de viagens.",
          life: 3000,
        });
      }
    };

    return (
      <main className="flex bg-slate-500  items-center justify-center min-h-screen">
        <Toast ref={toast} />
        <div className="w-full max-w-4xl p-8 bg-neutral-800 rounded-lg">
          <form
            onSubmit={handleSubmit(onSubmitFilter)}
            className="space-y-6 mb-5"
          >
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="customer_id"
                  className="block text-sm font-medium text-gray-100"
                >
                  ID do Usuário
                </label>
                <Input
                  type="text"
                  id="customer_id"
                  placeholder="Digite um UUID"
                  className="block w-full px-3 py-2 border rounded-md"
                  {...register("customer_id", {
                    required: "O ID é obrigatório",
                    validate: (value) =>
                      validateUUID(value) || "O ID deve ser um UUID válido",
                  })}
                />
                {errors.customer_id && (
                  <span className="text-red-600 text-sm">
                    {errors.customer_id.message}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <label
                  htmlFor="driver"
                  className="block text-sm font-medium text-gray-100"
                >
                  Motorista
                </label>
                <select
                  id="driver"
                  className="block w-full px-3 py-2 border rounded-md"
                  {...register("driver", { required: "Escolha um motorista" })}
                >
                  <option value="all">Mostrar todos</option>
                  {drivers &&
                    drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                </select>
                {errors.driver && (
                  <span className="text-red-600 text-sm">
                    {errors.driver.message}
                  </span>
                )}
              </div>
            </div>

            <Button type="submit" className="self-end">
              Aplicar Filtro
            </Button>
          </form>

          <ul className="space-y-4 mb-5">
            {rideHistory &&
              rideHistory.map((ride) => (
                <li
                  key={ride.id}
                  className="p-4 bg-gray-700 rounded-lg text-white"
                >
                  <p className="">
                    <i className="bx bx-calendar text-yellow-400"></i>
                    {new Date(ride.date).toLocaleString("pt-BR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>
                    {" "}
                    <i className="bx bx-map text-yellow-400"></i> {ride.origin}
                  </p>
                  <p>
                    {" "}
                    <i className="bx bx-map-pin text-yellow-400"></i>{" "}
                    {ride.destination}
                  </p>
                  <p>
                    <i className="bx bx-user text-yellow-400"></i>
                    {ride.driver.name}
                  </p>
                  <p>
                    <i className="bx bx-dollar text-yellow-400"></i>
                    {ride.value}
                  </p>
                </li>
              ))}
          </ul>
        </div>
      </main>
    );
  }

  if (rideData) {
    return (
      <main className="flex bg-slate-500  items-center justify-center min-h-screen">
        <Toast ref={toast} />
        <div className="flex w-full max-w-5xl p-4 space-x-4 bg-neutral-700 rounded-lg">
          <div className="w-2/3 h-96 mt-5">
            <Image src={mapStatic!} alt="bomba" width={1200} height={600} />
          </div>

          <div className="w-1/3 space-y-4">
            <ul className="flex flex-col gap-3">
              {rideData &&
                rideData.options.map((driver) => (
                  <li
                    key={driver.id}
                    className={`p-2 rounded-lg text-white shadow flex items-center gap-3 cursor-pointer ${
                      selectedDriver?.id === driver.id
                        ? "bg-yellow-600"
                        : "bg-gray-800"
                    }`}
                    onClick={() => handleSelectDriver(driver)}
                  >
                    <div>
                      <p className="font-bold">{driver.name}</p>
                      <RatingStars rating={driver.review?.rating || 0} />
                      <p>{driver.description}</p>
                      <p>Carro: {driver.vehicle}</p>
                      <p>R$ {driver.value}</p>
                    </div>
                  </li>
                ))}
            </ul>
            <Button onClick={handleConfirmRide}>Confirmar Viagem</Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex bg-slate-500 items-center justify-center min-h-screen">
      <Toast ref={toast} />
      <div className="bg-neutral-700  p-8 rounded-lg m-4 shadow-lg w-full max-w-md">
        <div className="flex justify-center">
          <LogoDisplay />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="id"
              className="block text-sm font-medium text-gray-100"
            >
              ID <span className="text-red-800">*</span>
            </label>
            <Input
              type="text"
              id="id"
              placeholder="Digite um UUID"
              {...register("customer_id", {
                required: "O ID é obrigatório",
                validate: (value) =>
                  validateUUID(value) || "O ID deve ser um UUID válido",
              })}
              className="block w-full px-3 py-2 border rounded-md"
            />
            {errors.customer_id && (
              <span className="text-red-600 text-sm">
                {errors.customer_id.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="origem"
              className="block text-sm font-medium text-gray-100"
            >
              Origem <span className="text-red-800">*</span>
            </label>
            <Input
              type="text"
              id="origem"
              placeholder="Seu local"
              {...register("origin", { required: "Campo obrigatório" })}
              className="block w-full px-3 py-2 border rounded-md"
            />
            {errors.origin && (
              <span className="text-red-600 text-sm">
                {errors.origin.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="destino"
              className="block text-sm font-medium text-gray-100"
            >
              Destino <span className="text-red-800">*</span>
            </label>
            <Input
              type="text"
              id="destino"
              placeholder="Destino"
              {...register("destination", { required: "Campo obrigatório" })}
              className="block w-full px-3 py-2 border rounded-md"
            />
            {errors.destination && (
              <span className="text-red-600 text-sm">
                {errors.destination.message}
              </span>
            )}
          </div>

          <Button type="submit">Buscar Viagem</Button>
        </form>
      </div>
    </main>
  );
}
