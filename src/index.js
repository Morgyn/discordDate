import nlp from 'compromise'
import datePlugin from 'compromise-dates'
nlp.plugin(datePlugin)

const source = document.getElementById('source');
const preview = document.getElementById('datePreview');

const
  WEEK_IN_MILLIS = 6.048e8,
  DAY_IN_MILLIS = 8.64e7,
  HOUR_IN_MILLIS = 3.6e6,
  MIN_IN_MILLIS = 6e4,
  SEC_IN_MILLIS = 1e3;

const timeFromNow = (date, formatter) => {
    const diff = date - Date.now(); 
    if (Math.abs(diff) > WEEK_IN_MILLIS)
      return formatter.format(Math.trunc(diff / WEEK_IN_MILLIS), 'week');
    else if (Math.abs(diff) > DAY_IN_MILLIS)
      return formatter.format(Math.trunc(diff / DAY_IN_MILLIS), 'day');
    else if (Math.abs(diff) > HOUR_IN_MILLIS)
      return formatter.format(Math.trunc((diff % DAY_IN_MILLIS) / HOUR_IN_MILLIS), 'hour');
    else if (Math.abs(diff) > MIN_IN_MILLIS)
      return formatter.format(Math.trunc((diff % HOUR_IN_MILLIS) / MIN_IN_MILLIS), 'minute');
    else
      return formatter.format(Math.trunc((diff % MIN_IN_MILLIS) / SEC_IN_MILLIS), 'second');
  };  


const setRow = function(type, utm) {
    const element = document.getElementById('dtd-'+type);
    const ut = Math.floor(utm / 1000);
    if (element == null)
        return;

    switch (type) {
        case 'd':
            element.querySelector("code").innerText = `<t:${ut}:${type}>`;
            element.querySelector("span.result").innerText = new Intl.DateTimeFormat(navigator.language, { dateStyle: 'short' }).format(utm);
            break;
        case 'D':
            element.querySelector("code").innerText = `<t:${ut}:${type}>`;
            element.querySelector("span.result").innerText = new Intl.DateTimeFormat(navigator.language, { dateStyle: 'long' }).format(utm);
            break;
        case 't':
            element.querySelector("code").innerText = `<t:${ut}:${type}>`;
            element.querySelector("span.result").innerText = new Intl.DateTimeFormat(navigator.language, { timeStyle: 'short' }).format(utm);
            break;
        case 'T':
            element.querySelector("code").innerText = `<t:${ut}:${type}>`;
            element.querySelector("span.result").innerText = new Intl.DateTimeFormat(navigator.language, { timeStyle: 'medium' }).format(utm);
            break;
        case 'f':
            element.querySelector("code").innerText = `<t:${ut}:${type}>`;
            var date = new Intl.DateTimeFormat(navigator.language, { dateStyle: 'medium' }).format(utm);
            var time = new Intl.DateTimeFormat(navigator.language, { timeStyle: 'short' }).format(utm);
            element.querySelector("span.result").innerText = `${date} ${time}`;
            break;
        case 'F':
            element.querySelector("code").innerText = `<t:${ut}:${type}>`;
            var date = new Intl.DateTimeFormat(navigator.language, { dateStyle: 'full' }).format(utm);
            var time = new Intl.DateTimeFormat(navigator.language, { timeStyle: 'short' }).format(utm);
            element.querySelector("span.result").innerText = `${date} ${time}`;
            break;
        case 'R':
            element.querySelector("code").innerText = `<t:${ut}:${type}>`;
            element.querySelector("span.result").innerText = timeFromNow(utm, new Intl.RelativeTimeFormat(navigator.language, { style: 'long' }));
            break;
        case 'u':
            element.querySelector("code").innerText = `${ut}`;
            element.querySelector("span.result").innerText = `${ut}`;
            break;
    }
}


const inputHandler = function(e) {
    const string = nlp(e.target.value);
    const result = string.dates().get();
  
    if (result.length != 0 &&Object.hasOwn(result[0], 'start') ) {
        const date = result[0]["start"];
        const utm = new Date(date).getTime();
        preview.innerText = new Intl.DateTimeFormat(navigator.language, { dateStyle: 'long', timeStyle: 'medium' }).format(utm);
        setRow("d", utm);
        setRow("D", utm);
        setRow("t", utm);
        setRow("T", utm);
        setRow("f", utm);
        setRow("F", utm);
        setRow("R", utm);
        setRow("u",utm);
    } else {
        preview.innerText = String.fromCharCode(160);
    }
}

source.addEventListener('input', inputHandler);
source.addEventListener('propertychange', inputHandler)

document.querySelectorAll(".copy-icon").forEach( e => {
    e.addEventListener('click', async (e) => {
        try {
            const element = e.target.parentNode
            await navigator.clipboard.writeText(element.innerText);
          } catch (err) {
            console.error('Copying to clipboard is flakey af:', err);
          }

    });
});