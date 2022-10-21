export function formatTime(time: GLfloat): string {
    return new Date(time).toLocaleString("pt-br").toString()
};

export function formatedDate(time: GLfloat): string {
    return new Date(time).toLocaleDateString("pt-br").toString()
};

export function formatedHour(time: GLfloat): string {
    return new Date(time).toLocaleTimeString("pt-br").toString()
};