import { Baseurl } from "@/../global";

export const getPrograms = async () => {
    const response = await fetch(`${Baseurl}programs/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    const json = await response.json();

    const programs = json;

    console.log(programs);

    return programs?.map(program => ({
        id: program.programs_id,
        start: program.programs_start,
        end: program.programs_end,
        user: program.programs_user,
        status: program.programs_status
    }));
}
