// components/PriorityRadioGroup.tsx

import { useBoardStore } from "@/store/BoardStore";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const priorities = [
  {
    id: "Low",
    name: "Low",
    color: "bg-green-500",
  },
  {
    id: "Medium",
    name: "Medium",
    color: "bg-yellow-500",
  },
  {
    id: "High",
    name: "High",
    color: "bg-red-500",
  },
];

function PriorityRadioGroup() {
  const [newPriority, setNewPriority] = useBoardStore((state) => [
    state.newPriority,
    state.setNewPriority,
  ]);

  return (
    <div className="w-full py-5">
      <RadioGroup
        value={newPriority}
        onChange={(e) => {
          setNewPriority(e);
        }}
      >
        <RadioGroup.Label className="text-base font-medium text-gray-900">
          Priority
        </RadioGroup.Label>
        <div className="mt-2 flex space-x-4">
          {priorities.map((priority) => (
            <RadioGroup.Option
              key={priority.id}
              value={priority.id}
              className={({ checked }) =>
                `${
                  checked
                    ? `${priority.color} bg-opacity-75 text-white`
                    : "bg-white"
                }
                relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
              }
            >
              {({ checked }) => (
                <>
                  <div className="flex items-center">
                    <div className="text-sm">
                      <RadioGroup.Label
                        as="p"
                        className={`font-medium ${
                          checked ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {priority.name}
                      </RadioGroup.Label>
                    </div>
                    {checked && (
                      <div className="shrink-0 text-white ml-2">
                        <CheckCircleIcon className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}

export default PriorityRadioGroup;
