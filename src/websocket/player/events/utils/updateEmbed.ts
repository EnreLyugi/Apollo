import { QueueData } from "../types";

export const HandleError = async function (_track: any, update: NodeJS.Timeout | null, _localization: string | undefined, data: any) {
    const queueData = data as QueueData;
    if (queueData.playerMessage) {
        await queueData.playerMessage.setState('finished');
    }
    if (update) clearInterval(update);
};
