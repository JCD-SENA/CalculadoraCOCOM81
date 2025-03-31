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

		//console.log(parseInt(idealTime))
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
			/>
			<input type="submit" value="calcular"/>
		</form>
	)
}