export default  {

formatDate(sValue: string | null): string {
        if (!sValue) {
            return "";
        }

        // Create a new Date object using the value
        const oDate = new Date(sValue);

        // Pad the date and month with a zero if they are less than 10
        const dd = oDate.getDate().toString().padStart(2, '0');
        const mm = (oDate.getMonth() + 1).toString().padStart(2, '0'); // +1 because months are zero-indexed
        const yyyy = oDate.getFullYear();

        // Return the formatted date string
        return `${dd}.${mm}.${yyyy}`;
    }
}

