import * as fs from 'fs';
import mmdb = require('maxmind');
import { InvalidDbBufferError } from './errors';
import Reader from './reader';
import ReaderModel from './readerModel';

describe('Reader', () => {
  describe('open()', () => {
    const file = 'success.test';

    it('passes the file to node-maxmind and resolves', () => {
      const spy = jest.spyOn(mmdb, 'open');

      expect.assertions(2);

      return Reader.open(file).then((reader) => {
        expect(spy).toHaveBeenCalledWith(file, undefined);
        expect(reader).toBeInstanceOf(ReaderModel);
      });
    });

    it('passes the file and options to node-maxmind and resolves', () => {
      const spy = jest.spyOn(mmdb, 'open');
      const options = {
        cache: {
          max: 100,
        },
      };

      expect.assertions(2);

      return Reader.open(file, options).then((reader) => {
        expect(spy).toHaveBeenCalledWith(file, options);
        expect(reader).toBeInstanceOf(ReaderModel);
      });
    });

    it('rejects the promise if node-maxmind errors out', () => {
      return expect(Reader.open('fail.test')).rejects.toThrowError(
        'some mocked error'
      );
    });
  });

  describe('openBuffer()', () => {
    it('returns a reader model if the buffer is a valid DB', () => {
      const buffer = fs.readFileSync('./fixtures/GeoIP2-City-Test.mmdb');
      expect(Reader.openBuffer(buffer)).toBeInstanceOf(ReaderModel);
    });

    it('throws an InvalidDbBufferError if buffer is not a valid DB', () => {
      expect(() => Reader.openBuffer(Buffer.from('foo'))).toThrowError(
        InvalidDbBufferError
      );
    });
  });
});
