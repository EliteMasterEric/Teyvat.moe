# data/i18n

This folder contains JSON files which describe how the site should be translated for users. The website fetches the

Since the files in this folder are loaded dynamically, you can simply create a new JSON file, whose name is [the BCP-47 locale](https://www.freecodecamp.org/news/how-to-get-started-with-internationalization-in-javascript-c09a0d2cd834/) to provide the translations for, and the site will pick it up and use it.

## Formatting

Formatting is done like so:

```
{
  bread:"bread",
  butter:"butter",
  question:"I'd like {0} and {1}, or just {0}"
  ...
  login: 'login',
  onlyForMembers: 'You have to {0} in order to use our app',
  bold: 'bold',
  iAmText: 'I am {0} text',
  ...
  january: 'January',
  currentDate: 'The current date is {month} {day}, {year}!'
}
```

```
f('currentDate', {
  month: t('january'),
  day: 12,
  year: 2018
});
```

## Localization Keys

Below is a description of the localization keys, as needed.

### about-translator-attribution

This string is blank on the English version, but is displayed at the bottom of the 'About' tab. Use this for translation attribution.

Example: `French localization provided by CoolBoy83 and TheDarkestOne.` (fake names and obviously not in French, but you get the idea)

### about-e / about-f

These two strings contain a {link} placeholder, which is replaced with a link (using the text of `click-here`) linking to English web pages.

### page-title

The title of the webpage as seen by the browser.
