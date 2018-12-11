// TODO: move it to common
function getValue(object) {
  return object.value;
}

export const languageOptions = [
  { value: 'en', display: 'English' },
  { value: 'zh', display: 'Chinese' },
  { value: 'fr', display: 'French' },
  { value: 'de', display: 'German' },
  { value: 'it', display: 'Italian' },
  { value: 'ja', display: 'Japanese' },
  { value: 'pt', display: 'Portuguese' },
  { value: 'ru', display: 'Russian' },
  { value: 'es', display: 'Spanish' },
  { value: 'oth', display: 'Other' },
];
export const languageValues = languageOptions.map(getValue);

export const subjectsOptions = [
  { value: 'Accelerators' },
  { value: 'Astrophysics' },
  { value: 'Astrophysics' },
  { value: 'Data Analysis and Statistics' },
  { value: 'Experiment-HEP' },
  { value: 'Experiment-Nucl' },
  { value: 'General Physics' },
  { value: 'Gravitation and Cosmology' },
  { value: 'Instumentation' },
  { value: 'Lattice' },
  { value: 'Math and Math Physics' },
  { value: 'Other' },
];
export const subjectsValues = subjectsOptions.map(getValue);
