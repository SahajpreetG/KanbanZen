'use client'

import { useBoardStore } from "@/store/BoardStore";
import { RadioGroup, Radio, Field, Label, Description } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const types = [
    {
       id: "todo",
       name: "Todo",
       description: "A new task to be completed",
       color: "bg-red-500",
    },
    {
        id: "inprogress",
        name: "In Progress",
        description: "A task that is currently being worked on",
        color: "bg-yellow-500",
    },
    {
        id: "done",
        name: "Done",
        description: "A task that has been completed",
        color: "bg-green-500",
    },
];

function TaskTypeRadioGroup() {
    const [setNewTaskType, newTaskType] = useBoardStore((state) => [
        state.setNewTaskType,
        state.newTaskType,
    ]);

  return (
    <div className="w-full py-5">
        <div className="mx-auto w-full max-w-md">
            <RadioGroup
            value={newTaskType}
            onChange={(e) => {
                setNewTaskType(e);
            }}
            >
                <div className="space-y-2">
                    {types.map((type) => (
                        <Field key={type.id}>
                            <Radio
                                value={type.id}
                                className={({ checked }) =>
                                `${
                                    checked
                                    ? `${type.color} bg-opacity-75 text-white`
                                    : "bg-white"
                                }
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-60 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300
                                relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md`
                                }
                            >
                                {({ checked }) => (
                                    <>
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="text-sm">
                                                <Label
                                                as="p"
                                                className={`font-medium ${
                                                    checked ? "text-white" : "text-gray-900"
                                                }`}
                                                >
                                                    {type.name}
                                                </Label>
                                                <Description
                                                as="span"
                                                className={`inline ${
                                                    checked ? "text-white" : "text-gray-500"
                                                }`}
                                                >
                                                    <span>{type.description}</span>
                                                </Description>
                                            </div>
                                        </div>
                                        {checked && (
                                            <div className="shrink-0 text-white">
                                                <CheckCircleIcon className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>
                                    </>
                                )}
                            </Radio>
                        </Field>
                    ))}
                </div>
            </RadioGroup>
        </div>
    </div>
  )
}

export default TaskTypeRadioGroup;
