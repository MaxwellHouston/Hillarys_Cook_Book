import { MouseEvent } from 'react'
import { IoAddCircleSharp } from 'react-icons/io5'
import DirectionInput from './DirectionInput'
import { Direction } from '../../types'

interface DirectionsFormProps {
  directionsList: Direction[];
  updateDirectionsList: (list: Direction[]) => void;
}

export default function DirectionsForm({
  directionsList,
  updateDirectionsList,
}: DirectionsFormProps) {
  const addDirection = (e: MouseEvent) => {
    e.preventDefault()
    updateDirectionsList([...directionsList, { description: '' }])
  }

  const deleteDirection = (step: number) => {
    let updatedList = directionsList.filter(
      (_direction, index) => step !== index + 1,
    )
    updateDirectionsList(updatedList)
  }

  const updateDescription = (step: number, input: string) => {
    let updatedList = directionsList.map((direction, index) => {
      if (index + 1 === step) {
        return { description: input }
      } else {
        return direction
      }
    })
    updateDirectionsList(updatedList)
  }

  const renderDirections = () => {
    let list = directionsList.map((direction, index) => (
      <DirectionInput
        key={index + 1}
        step={index + 1}
        description={direction.description}
        updateDescription={updateDescription}
        deleteDirection={deleteDirection}
      />
    ))
    return list
  }

  return (
    <fieldset>
      <h2 className="font-bold">Directions:</h2>
      <ul>{renderDirections()}</ul>
      <button className="float-right" onClick={addDirection}>
        <IoAddCircleSharp className="text-2xl" />
      </button>
    </fieldset>
  )
}
