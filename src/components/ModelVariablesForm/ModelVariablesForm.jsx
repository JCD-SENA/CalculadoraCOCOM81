import { useForm } from "react-hook-form"
import { useState } from "react"

import { InputForm } from "./InputForm/InputForm"
import { SelectForm } from "./SelectForm/SelectForm"

export const ModelVariablesForm = () => {
	const {register, handleSubmit, watch, formState: {errors} } = useForm()

	const [calculationError, setCalculationError] = useState(null);
	
	// Observar personel e idealTime para validación condicional
	const watchPersonel = watch("personel");
	const watchIdealTime = watch("idealTime");

	const modes = ["Organico", "Semilibre", "Rigido"]
	const values = ["Muy bajo", "Bajo", "Nominal", "Alto", "Muy alto", "Extremadamente alto"]

	const handleInformation = ({ kloc, wage, personel, idealTime, mode, RELY, DATA, CPLX, TIME, STOR, VIRT, TURN, ACAP, AEXP, PCAP, VEXP, LEXP, MODP, TOOL, SCED }) => {
		try {
			// Resetear errores previos
			setCalculationError(null);
			
			// Validaciones de valores
			if (parseFloat(kloc) <= 0) {
				throw new Error("KLOC debe ser mayor que 0");
			}
			
			if (parseFloat(wage) <= 0) {
				throw new Error("El sueldo debe ser mayor que 0");
			}
			
			if (idealTime && parseFloat(idealTime) <= 0) {
				throw new Error("El tiempo ideal debe ser mayor que 0");
			}
			
			if (personel && parseFloat(personel) <= 0) {
				throw new Error("La cantidad de personal debe ser mayor que 0");
			}
			
			if (!idealTime && !personel) {
				throw new Error("Debe proporcionar la cantidad de personal o el tiempo ideal de desarrollo");
			}
			
			// Código original de cálculo
			let [a, b, c, d] = [0, 0, 0, 0]
			switch (mode) {
				case "Organico":
					[a, b, c, d] = [2.4, 1.05, 2.5, 0.38]
					break	
				case "Semilibre":
					[a, b, c, d] = [3, 1.12, 2.5, 0.35]
					break
				case "Rigido":
					[a, b, c, d] = [3.6, 1.2, 2.5, 0.32]
					break
				default:
					throw new Error("Modo de desarrollo no válido");
			}
			
			// Asegurar que todos los multiplicadores son números válidos
			const factores = [RELY, DATA, CPLX, TIME, STOR, VIRT, TURN, ACAP, AEXP, PCAP, VEXP, LEXP, MODP, TOOL, SCED];
			for (const factor of factores) {
				if (isNaN(parseFloat(factor))) {
					throw new Error("Todos los factores de ajuste deben ser valores numéricos válidos");
				}
			}
			
			const m = RELY * DATA * CPLX * TIME * STOR * VIRT * TURN * ACAP * AEXP * PCAP * VEXP * LEXP * MODP * TOOL * SCED
			const numKloc = parseFloat(kloc);
			const E = a * (numKloc ** b) * m
			let Tdev = 0
			let P = 0
			
			if (!isNaN(parseInt(idealTime))) { // Se asume que si el tiempo ideal está especificado, entonces la cantidad del personal lo está   
				Tdev = parseFloat(idealTime)
				P = Math.ceil(E/Tdev)
				
				// Validar que P sea razonable
				if (P <= 0 || P > 10000) {
					throw new Error(`El número calculado de personal (${P}) no parece razonable. Revisa los datos de entrada.`);
				}
			} else {
				P = parseInt(personel)
				Tdev = c * (E ** d)
				
				// Validar que Tdev sea razonable
				if (Tdev <= 0 || Tdev > 120) { // máximo 10 años
					throw new Error(`El tiempo calculado (${Math.ceil(Tdev)} meses) no parece razonable. Revisa los datos de entrada.`);
				}
			}
			
			//Para incrementar un 5% el sueldo cada año
			let totalCost = 0
			for (let month=1; month<=Tdev; month++) {
				totalCost += (parseFloat(wage) + ((parseFloat(wage)/100) * (5 * (Math.ceil(month/12)-1)))) * P
			}
			
			// Formatear el resultado para mejor legibilidad
			totalCost = Math.round(totalCost * 100) / 100;
			const mensaje = `Se estima que el proyecto va a tomar ${Math.ceil(Tdev)} meses y va a costar $${totalCost.toLocaleString('es-MX')} con un estudio de ${P} desarrolladores.`;
			
			alert(mensaje);
		} catch (error) {
			alert(`Error: ${error.message}`);
			setCalculationError(error.message);
		}
	}
	
	return (
		<form className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-amber-50 dark:bg-amber-50 rounded-lg shadow-lg"onSubmit={handleSubmit(handleInformation)}>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="col-span-1 md:col-span-2">
					<h2 className="text-xl font-semibold text-blue-800 dark:text-blue-800 mb-4">Información General</h2>
				</div>
				
				<InputForm
					name="kloc"
					type="number"
					register={{
						required: "Se debe ingresar las kilo-lineas de codigo",
						min: {
							value: 0.1,
							message: "KLOC debe ser mayor que 0"
						}
					}}
					placeholder="Ingrese las kilo-lineas de codigo"
					label="Kilo-lineas de codigo del proyecto (KLOC)"
					form={{ register: register, errors: errors }}
					className="mb-4"
				/>
				
				<InputForm
					name="wage"
					type="number"
					register={{
						required: "Se debe ingresar el sueldo mensual",
						min: {
							value: 0.01,
							message: "El sueldo debe ser mayor que 0"
						}
					}}
					placeholder="Ingrese el sueldo mensual"
					label="Sueldo mensual"
					form={{ register: register, errors: errors }}
					className="mb-4"
				/>
				
				<InputForm
					name="personel"
					type="number"
					placeholder="Ingrese la cantidad de trabajadores"
					label="Cantidad de trabajadores"
					register={{
						min: {
							value: 1,
							message: "La cantidad debe ser al menos 1"
						},
						validate: value => {
							if (!value && !watchIdealTime) {
								return "Debe especificar personal o tiempo ideal";
							}
							return true;
						}
					}}
					form={{ register: register, errors: errors }}
					className="mb-4"
				/>
				
				<InputForm
					name="idealTime"
					type="number"
					placeholder="Meses ideales de desarrollo"
					label="Meses de desarrollo ideales"
					register={{
						min: {
							value: 1,
							message: "El tiempo debe ser al menos 1 mes"
						},
						validate: value => {
							if (!value && !watchPersonel) {
								return "Debe especificar personal o tiempo ideal";
							}
							return true;
						}
					}}
					form={{ register: register, errors: errors }}
					className="mb-4"
				/>
				
				<div className="col-span-1 md:col-span-2">
					<SelectForm
						name="mode"
						placeholder="Seleccione un modo"
						label="Modo de desarrollo"
						options={modes}
						register={{
							required: "Se debe especificar modo de desarrollo"
						}}
						form={{ register: register, errors: errors }}
						className="mb-6"
					/>
				</div>
				
				<div className="col-span-1 md:col-span-2">
					<h2 className="text-xl font-semibold text-blue-800 dark:text-blue-800 mb-4">Atributos del producto</h2>
				</div>
				
				<SelectForm
					name="RELY"
					label="Fiabilidad requerida del software"
					placeholder="Seleccione la valoración"
					options={values.slice(0, 5)}
					register={{
						required: "Se debe especificar la fiabilidad"
					}}
					form={{ register: register, errors: errors }}
					className="mb-4"
					values={[0.75, 0.88, 1, 1.15, 1.4]}
				/>
				
				<SelectForm
					name="DATA"
					label="Tamaño de la base de datos"
					placeholder="Seleccione la valoración"
					options={values.slice(1, 6)}
					register={{
						required: "Se debe especificar el tamaño de la base de datos"
					}}
					form={{ register: register, errors: errors }}
					className="mb-4"
					values={[0.94, 1, 1.08, 1.16]}
				/>
				
				<div className="col-span-1 md:col-span-2">
					<SelectForm
						name="CPLX"
						label="Complejidad del producto"
						placeholder="Seleccione la valoración"
						options={values}
						register={{
							required: "Se debe especificar la complejidad del producto"
						}}
						form={{ register: register, errors: errors }}
						className="mb-6"
						values={[0.7, 0.85, 1, 1.15, 1.3, 1.65]}
					/>
				</div>
				
				<div className="col-span-1 md:col-span-2">
					<h2 className="text-xl font-semibold text-blue-800 dark:text-blue-800 mb-4">Atributos de la computadora</h2>
				</div>
				
				<SelectForm
					name="TIME"
					label="Restricciones del tiempo de ejecución"
					placeholder="Seleccione la valoración"
					options={values.slice(2, 6)}
					register={{
						required: "Se debe especificar"
					}}
					form={{ register: register, errors: errors }}
					className="mb-4"
					values={[1, 1.11, 1.3, 1.66]}
				/>
				
				<SelectForm
					name="STOR"
					label="Restricciones del almacenamiento principal"
					placeholder="Seleccione la valoración"
					options={values.slice(2, 6)}
					register={{
						required: "Se debe especificar"
					}}
					form={{ register: register, errors: errors }}
					className="mb-4"
					values={[1, 1.06, 1.21, 1.56]}
				/>
				
				<SelectForm
					name="VIRT"
					label="Inestabilidad de la máquina virtual"
					placeholder="Seleccione la valoración"
					options={values.slice(1, 5)}
					register={{
						required: "Se debe especificar"
					}}
					form={{ register: register, errors: errors }}
					className="mb-4"
					values={[0.87, 1, 1.15, 1.3]}
				/>
				
				<SelectForm
					name="TURN"
					label="Tiempo de respuesta del computador"
					placeholder="Seleccione la valoración"
					options={values.slice(1, 5)}
					register={{
						required: "Se debe especificar"
					}}
					form={{ register: register, errors: errors }}
					className="mb-6"
					values={[0.87, 1, 1.07, 1.15]}
				/>
				
				<div className="col-span-1 md:col-span-2">
					<h2 className="text-xl font-semibold text-blue-800 dark:text-blue-800 mb-4">Atributos del personal</h2>
				</div>
				
				<SelectForm
					name="ACAP"
					label="Capacidad del analista"
					placeholder="Seleccione la valoración"
					options={values.slice(0, 5)}
					register={{
						required: "Se debe especificar"
					}}
					form={{ register: register, errors: errors }}
					className="mb-4"
					values={[1.46, 1.19, 1, 0.86, 0.71]}
				/>
				
				<SelectForm
					name="AEXP"
					label="Experiencia en la aplicación"
					placeholder="Seleccione la valoración"
					options={values.slice(0, 5)}
					register={{
						required: "Se debe especificar"
					}}
					form={{ register: register, errors: errors }}
					className="mb-4"
					values={[1.29, 1.13, 1, 0.91, 0.82]}
				/>
				
				<SelectForm
					name="PCAP"
					label="Capacidad de los programadores"
					placeholder="Seleccione la valoración"
					options={values.slice(0, 5)}
					register={{
						required: "Se debe especificar"
					}}
					form={{ register: register, errors: errors }}
					className="mb-4"
					values={[1.42, 1.17, 1, 0.86, 0.7]}
				/>
				
				<SelectForm
					name="VEXP"
					label="Experiencia en el sistema operativo utilizado"
					placeholder="Seleccione la valoración"
					options={values.slice(0, 4)}
					register={{
						required: "Se debe especificar"
					}}
					form={{ register: register, errors: errors }}
					className="mb-4"
					values={[1.21, 1.1, 1, 0.9]}
				/>
				
				<SelectForm
					name="LEXP"
					label="Experiencia en el lenguaje de programación"
					placeholder="Seleccione la valoración"
					options={values.slice(0, 4)}
					register={{
						required: "Se debe especificar"
					}}
					form={{ register: register, errors: errors }}
					className="mb-6"
					values={[1.14, 1.07, 1, 0.95]}
				/>
				
				<div className="col-span-1 md:col-span-2">
					<h2 className="text-xl font-semibold text-blue-800 dark:text-blue-800 mb-4">Atributos del proyecto</h2>
				</div>
				
				<SelectForm
					name="MODP"
					label="Uso de prácticas de programación modernas"
					placeholder="Seleccione la valoración"
					options={values.slice(0, 5)}
					register={{
						required: "Se debe especificar"
					}}
					form={{ register: register, errors: errors }}
					className="mb-4"
					values={[1.24, 1.1, 1, 0.91, 0.82]}
				/>
				
				<SelectForm
					name="TOOL"
					label="Uso de herramientas software"
					placeholder="Seleccione la valoración"
					options={values.slice(0, 5)}
					register={{
						required: "Se debe especificar"
					}}
					form={{ register: register, errors: errors }}
					className="mb-4"
					values={[1.24, 1.1, 1, 0.91, 0.83]}
				/>
				
				<div className="col-span-1 md:col-span-2">
					<SelectForm
						name="SCED"
						label="Restricciones en la duración del proyecto"
						placeholder="Seleccione la valoración"
						options={values.slice(0, 5)}
						register={{
							required: "Se debe especificar"
						}}
						form={{ register: register, errors: errors }}
						className="mb-6"
						values={[1.23, 1.08, 1, 1.04, 1.1]}
					/>
				</div>
				
				{/* Mensaje de error si existe */}
				{calculationError && (
					<div className="col-span-1 md:col-span-2 mb-4">
						<div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
							Error: {calculationError}
						</div>
					</div>
				)}
				
				<div className="col-span-1 md:col-span-2">
					<button 
						type="submit" 
						className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out transform hover:-translate-y-1 shadow-md"
					>
						Calcular
					</button>
				</div>
			</div>
		</form>
	);
};