"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
    FormItem,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DottedSeparator } from "@/components/dotted-separator";
import { RoomSchema } from "../schemas";
import { useCreateRoom } from "../api/use-create-room";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { RoomType } from "../types";

interface CreateRoomFormProps {
    onCancel?: () => void;
}

const CreateChannelForm = ({ onCancel }: CreateRoomFormProps) => {

    const workspaceId = useWorkspaceId();

    const router = useRouter();

    const { mutate, isPending } = useCreateRoom();

    const form = useForm<z.infer<typeof RoomSchema>>({
        resolver: zodResolver(RoomSchema),
        defaultValues: {
            name: "",
            roomType: RoomType.TEXT,
            workspaceId: workspaceId,
        },
    });

    useEffect(() => {
        form.setValue("roomType", RoomType.TEXT);
    }, [RoomType]);

    const onSubmit = async (values: z.infer<typeof RoomSchema>) => {

        try {
            mutate({ json: { ...values, workspaceId } }, {
                onSuccess: ({ data }) => {
                    form.reset();
                    router.push(`/workspaces/${workspaceId}/channels/${data.$id}`)
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Card className="size-full border-none shadow-none">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">Create new Room</CardTitle>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator />
            </div>
            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Room name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter room name" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="roomType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Room Type</FormLabel>
                                        <Select
                                            disabled={isPending}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus-visible:ring-offset-0 capitalize outline-none">
                                                    <SelectValue placeholder="Select a room type" />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {Object.values(RoomType).map((type) => (
                                                    <SelectItem
                                                        key={type}
                                                        value={type}
                                                        className="capitalize"
                                                    >
                                                        {type.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DottedSeparator className="py-7" />
                        <div className="flex items-center justify-between">
                            <Button
                                type="button"
                                size="lg"
                                variant="secondary"
                                onClick={onCancel}
                                disabled={isPending}
                                className={cn(!onCancel && "invisible")}
                            >
                                Cancel
                            </Button>
                            <Button disabled={isPending} type="submit" size="lg">
                                Create Room
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default CreateChannelForm;
