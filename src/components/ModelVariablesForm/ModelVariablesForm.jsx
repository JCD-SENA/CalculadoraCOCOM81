import { useForm } from "react-hook-form"

import { InputForm } from "./InputForm/InputForm"
import { SelectForm } from "./SelectForm/SelectForm"

export const ModelVariablesForm = () => {
	const {register, handleSubmit, formState: {errors} } = useForm()

	const modes = ["Organico", "Semilibre", "Rigido"]
	const values = ["Muy bajo", "Bajo", "Nominal", "Alto", "Muy alto", "Extremadamente alto"]

	const handleInformation = ({ kloc, wage, personel, idealTime, mode, RELY, DATA, CPLX, TIME, STOR, VIRT, TURN, ACAP, AEXP, PCAP, VEXP, LEXP, MODP, TOOL, SCED }) => {
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
		}
		const m = RELY * DATA * CPLX * TIME * STOR * VIRT * TURN * ACAP * AEXP * PCAP * VEXP * LEXP * MODP * TOOL * SCED
		const E = a * (kloc ** b) * m
		let Tdev = 0
		let P = 0
		if (!IsNaN(parseInt(idealTime))) { // Se asume que si el tiempo ideal no está especificado, entonces la cantidad del personal lo está   
			Tdev = idealTime
			P = E/Tdev
		} else {
			P = personel
			Tdev = c * (E ** d)
		}
		//Para incrementar un 5% el sueldo cada año
		const years = Math.ceil(Tdev / 12)
	}

	return (
		<form className="variablesForm" onSubmit={handleSubmit(handleInformation)}>
			<InputForm
				name="kloc"
				type="number"
				register={{
					required: "Se debe ingresar las kilo-lineas de codigo"
				}}
				placeholder="Ingrese las kilo-lineas de codigo"
				label="Kilo-lineas de codigo del proyecto (KLOC)"
				form={{register: register, errors: errors}}
			/>
			<InputForm
				name="wage"
				type="number"
				register={{
					required: "Se debe ingresar el sueldo mensual"
				}}
				placeholder="Ingrese el sueldo mensual de cada programador"
				label="Sueldo mensual"
				form={{register: register, errors: errors}}
			/>
			{/* Se debe validar que se ingrese la cantidad de personas, o el tiempo y de ahí determinar la cantidad de personas */}
			<InputForm
				name="personel"
				type="number"
				placeholder="Ingrese el sueldo mensual de cada programador"
				label="Cantidad de trabajadores"
				form={{register: register, errors: errors}}
			/>
			<InputForm
				name="idealTime"
				type="number"
				placeholder="Ingrese la cantidad de meses ideales que va a tomar el desarrollo"
				label="Meses de desarrollo ideales"
				form={{register: register, errors: errors}}
			/>
			<SelectForm
				name="mode"
				placeholder="Seleccione un modo"
				label="Modo de desarrollo"
				options={modes}
				register={{
					required: "Se debe especificar modo de desarrollo"
				}}
				form={{register: register, errors: errors}}
			/>
			<b>Atributos del producto</b>
			<SelectForm
				name="RELY"
				label="Fiabilidad requerida del software"
				placeholder="Seleccione la valoración"
				options={values.slice(0,5)}
				register={{
					required: "Se debe especificar la fiabilidad"
				}}
				form={{register: register, errors: errors}}
				values={[0.75, 0.88, 1, 1.15, 1.4]}
			/>
			<SelectForm
				name="DATA"
				label="Tamaño de la base de datos"
				placeholder="Seleccione la valoración"
				options={values.slice(1,6)}
				register={{
					required: "Se debe especificar el tamaño de la base de datos"
				}}
				form={{register: register, errors: errors}}
				values={[0.94, 1, 1.08, 1.16]}
			/>
			<SelectForm
				name="CPLX"
				label="Complejidad del producto"
				placeholder="Seleccione la valoración"
				options={values}
				register={{
					required: "Se debe especificar la complejidad del producto"
				}}
				form={{register: register, errors: errors}}
				values={[0.7, 0.85, 1, 1.15, 1.3, 1.65]}
			/>
			<b>Atributos de la computadora</b>
			<SelectForm
				name="TIME"
				label="Restricciones del tiempo de ejecución"
				placeholder="Seleccione la valoración"
				options={values.slice(2,6)}
				register={{
					required: "Se debe especificar"
				}}
				form={{register: register, errors: errors}}
				values={[1, 1.11, 1.3, 1.66]}
			/>
			<SelectForm
				name="STOR"
				label="Restricciones del almacenamento principal"
				placeholder="Seleccione la valoración"
				options={values.slice(2,6)}
				register={{
					required: "Se debe especificar"
				}}
				form={{register: register, errors: errors}}
				values={[1, 1.06, 1.21, 1.56]}
			/>
			<SelectForm
				name="VIRT"
				label="Inestabilidad de la máquina virtual"
				placeholder="Seleccione la valoración"
				options={values.slice(1,5)}
				register={{
					required: "Se debe especificar"
				}}
				form={{register: register, errors: errors}}
				values={[0.87, 1, 1.15, 1.3]}
			/>
			<SelectForm
				name="TURN"
				label="Tiempo de resupuesta del computador"
				placeholder="Seleccione la valoración"
				options={values.slice(1,5)}
				register={{
					required: "Se debe especificar"
				}}
				form={{register: register, errors: errors}}
				values={[0.87, 1, 1.07, 1.15]}
			/>
			<b>Atributos del personal</b>
			<SelectForm
				name="ACAP"
				label="Capacidad del analista"
				placeholder="Seleccione la valoración"
				options={values.slice(0, 5)}
				register={{
					required: "Se debe especificar"
				}}
				form={{register: register, errors: errors}}
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
				form={{register: register, errors: errors}}
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
				form={{register: register, errors: errors}}
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
				form={{register: register, errors: errors}}
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
				form={{register: register, errors: errors}}
				values={[1.14, 1.07, 1, 0.95]}
			/>
			<b>Atributos del proyecto</b>
			<SelectForm
				name="MODP"
				label="Uso de prácticas de programación modernas"
				placeholder="Seleccione la valoración"
				options={values.slice(0, 5)}
				register={{
					required: "Se debe especificar"
				}}
				form={{register: register, errors: errors}}
				values={[1.24, 1.1, 0, 0.91, 0.82]}
			/>
			<SelectForm
				name="TOOL"
				label="Uso de herramientas software"
				placeholder="Seleccione la valoración"
				options={values.slice(0, 5)}
				register={{
					required: "Se debe especificar"
				}}
				form={{register: register, errors: errors}}
				values={[1.24, 1.1, 1, 0.91, 0.83]}
			/>
			<SelectForm
				name="SCED"
				label="Restricciones en la duración del proyecto"
				placeholder="Seleccione la valoración"
				options={values.slice(0, 5)}
				register={{
					required: "Se debe especificar"
				}}
				form={{register: register, errors: errors}}
				values={[1.23, 1.08, 1, 1.04, 1.1]}
			/>
			<input type="submit" value="calcular"/>
		</form>
	)
}