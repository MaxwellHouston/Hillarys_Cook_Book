import { SyntheticEvent, useEffect, useState } from 'react'
import { Group } from '../../types'

interface IngredientGroupTagsProps {
  groups: Group[];
  tag: string | null;
  update: (value: string) => void;
}

export default function IngredientGroupTags({ groups, tag, update }: IngredientGroupTagsProps) {
  const [groupList, setGroupList] = useState<string[]>([])

  useEffect(() => {
    setGroupList(groups.map((group) => group.name).filter(Boolean))
  }, [groups])

  return (
    <select
      value={tag ?? ''}
      onChange={(e) => update(e.target.value)}
      className="w-1/4 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
    >
      <option value="">Tag</option>
      {groupList.map((g) => (
        <option key={g} value={g}>{g}</option>
      ))}
    </select>
  )
}
