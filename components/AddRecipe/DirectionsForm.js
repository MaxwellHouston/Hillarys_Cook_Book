import { useState } from 'react'
import { IoAddCircleSharp } from 'react-icons/io5'
import DirectionInput from './DirectionInput'

export default function DirectionsForm({
  directionsList,
  updateDirectionsList,
}) {
  const addDirection = (e) => {
    e.preventDefault()
    updateDirectionsList([...directionsList, { description: '' }])
  }

  const deleteDirection = (step) => {
    let updatedList = directionsList.filter(
      (direction, index) => step !== index + 1,
    )
    updateDirectionsList(updatedList)
  }

  const updateDescription = (step, input) => {
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
