import { Text } from '@blockcode/ui';
import translations from './l10n.yaml';
import iconURI from './icon.png';
import { downloadDevice } from '@blockcode/device-pyboard';

export default {
  iconURI,
  name: (
    <Text
      id="extension.nes.name"
      defaultMessage="Broadcast"
    />
  ),
  blocks: [
    {
      button: 'DOWNLOAD_ROM',
      text: (
        <Text
          id="extension.nes.download"
          defaultMessage="Download ROM"
        />
      ),
      onClick(e) {
        console.log(this, e);
      },
    },
  ],
  translations,
};
