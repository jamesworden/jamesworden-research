export enum Option {
  PANORAMA_TEXT = 'panoramaText',
  PANORAMA_ID = 'panoramaId'
}

export function getOptions(
  panoramaId: boolean,
  panoramaText: boolean
): Option[] {
  const options: Option[] = []

  if (panoramaId) {
    options.push(Option.PANORAMA_ID)
  }

  if (panoramaText) {
    options.push(Option.PANORAMA_TEXT)
  }

  return options
}
