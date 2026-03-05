import { Autocomplete, TextField } from '@mui/material'
import { SyntheticEvent, useEffect, useState } from 'react'
import { Group } from '../../types'

interface IngredientGroupTagsProps {
  groups: Group[];
  tag: string | null;
  update: (value: string) => void;
}

export default function IngredientGroupTags({ groups, tag, update }: IngredientGroupTagsProps) {
  const [groupList, setGroupList] = useState<string[]>([])

  const handleTagChange = (_event: SyntheticEvent, values: string) => {
    update(values)
  }

  useEffect(() => {
    setGroupList(groups.map((group) => group.name))
  }, [groups])

  return (
    <Autocomplete
      className="w-1/4"
      size="small"
      includeInputInList
      disableClearable
      options={groupList.filter((group) => group)}
      renderInput={(params) => <TextField {...params} label="Tags" />}
      value={tag ?? undefined}
      onChange={handleTagChange}
    />
  )
}
