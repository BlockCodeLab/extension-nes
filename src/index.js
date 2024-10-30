import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  eegg: true,
  name: 'NES emulator',
  description: 'Emulates the NES game console.',
  collaborator: 'Yeqin Gong',
  image: featureImage,
  icon: iconImage,
  tags: ['arcade'],

  // l10n
  translations: {
    en: {
      name: 'NES emulator',
      description: 'Emulates the NES game console.',
      collaborator: 'Yeqin Gong',
    },
    'zh-Hans': {
      name: 'NES 模拟器',
      description: 'NES 游戏模拟器。',
      collaborator: '龚业勤',
    },
  },
};
