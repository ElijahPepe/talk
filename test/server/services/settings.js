const Settings = require('../../../services/settings');
const chai = require('chai');
const expect = chai.expect;

describe('services.SettingsService', () => {
  beforeEach(() => Settings.init({ moderation: 'PRE', wordlist: ['donut'] }));

  describe('#retrieve()', () => {
    it('should have a moderation field defined', () => {
      return Settings.retrieve().then(settings => {
        expect(settings)
          .to.have.property('moderation')
          .and.to.equal('PRE');
      });
    });

    it('should have two infoBox fields defined', () => {
      return Settings.retrieve().then(settings => {
        expect(settings)
          .to.have.property('infoBoxEnable')
          .and.to.equal(false);
        expect(settings)
          .to.have.property('infoBoxContent')
          .and.to.equal('');
      });
    });
  });

  describe('#select()', () => {
    it('should have a moderation field defined and not wordlist', () => {
      return Settings.select('moderation').then(settings => {
        expect(settings)
          .to.have.property('moderation')
          .and.to.equal('PRE');
        expect(settings).to.not.have.property('wordlist');
      });
    });
  });

  describe('#update()', () => {
    it('should update the settings with a passed object', () => {
      const mockSettings = {
        moderation: 'POST',
        infoBoxEnable: true,
        infoBoxContent: 'yeah',
      };
      return Settings.update(mockSettings).then(updatedSettings => {
        expect(updatedSettings).to.be.an('object');
        expect(updatedSettings)
          .to.have.property('moderation')
          .and.to.equal('POST');
        expect(updatedSettings).to.have.property('infoBoxEnable', true);
        expect(updatedSettings).to.have.property('infoBoxContent', 'yeah');
      });
    });

    it('should be ok when receiving an object based off of a mongoose model', async () => {
      const mockSettings = {
        moderation: 'POST',
        infoBoxEnable: true,
        infoBoxContent: 'yeah',
      };
      await Settings.update(mockSettings);

      const settings = await Settings.retrieve();
      settings.charCount = 500;

      await Settings.update(settings.toObject());
    });
  });

  describe('#get', () => {
    it('should return the moderation settings', () => {
      return Settings.retrieve().then(({ moderation }) => {
        expect(moderation).not.to.be.null;
      });
    });
  });
});
