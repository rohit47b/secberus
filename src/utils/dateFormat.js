import moment from 'moment'

export const convertDateFormatWithDateTime = (date) => {
    // moment.updateLocale('es');
    if (date && date !== null  && date !== 'null' && date.toString().trim().length > 0) {
        return moment(date).format("MM/DD/YYYY hh:mm A")
    } else {
        return
    }
}


export const convertLongDateFormatWithDateTime = (date) => {
    // moment.updateLocale('es');
    if (date && date !== null  && date !== 'null' && date.toString().trim().length > 0) {
        return moment.unix(date).format("MM/DD/YYYY hh:mm A")
    } else {
        return
    }
}

export const convertDateFormatWithDate = (date) => {
    // moment.updateLocale('es');
    if (date && date !== null  && date !== 'null' && date.toString().trim().length > 0) {
        return moment(date).format("MMM/DD/YYYY")
    } else {
        return
    }
}

export const convertDateFormatWithDate1 = (date) => {
    // moment.updateLocale('es');
    if (date && date !== null  && date !== 'null' && date.toString().trim().length > 0) {
        return moment(date).format("MM/DD/YYYY")
    } else {
        return
    }
}


export const convertDateFormatWithTime = (date) => {
    // moment.updateLocale('es');
    if (date && date !== null  && date !== 'null' &&  date.trim().length > 0) {
        return moment(date).format("hh:mm A")
    } else {
        return
    }
}


export const calculateAgoTime = (date) => {
    moment.updateLocale('es', {
        relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: 'a few seconds',
            ss: 'today %d seconds',
            m: "a minute",
            mm: "today %d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        }
    });
    if (date && date !== null  && date !== 'null' && date.trim().length > 0) {
        return moment(new Date(date).getTime()).fromNow()
    } else {
        return
    }
}


export const calculateAgoTimeByLongFormat = (date) => {
    moment.updateLocale({
        relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: 'a few seconds',
            ss: 'today %d seconds',
            m: "a minute",
            mm: "today %d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        }
    });
    if (date && date !== null  && date !== 'null') {
        return  moment.unix(date).fromNow()
    } else {
        return
    }
}



export const calculateDaysFromTimeByLongFormat = (date) => {
    if (date && date !== null  && date !== 'null') {
        return  moment.unix(date).fromNow()
    } else {
        return
    }
}

