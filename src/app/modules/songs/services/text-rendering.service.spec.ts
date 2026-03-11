import {TestBed} from '@angular/core/testing';
import {TextRenderingService} from './text-rendering.service';
import {LineType} from './line-type';
import {SectionType} from './section-type';
import {TransposeService} from './transpose.service';
import {ChordAddDescriptor} from './chord';

describe('TextRenderingService', () => {
  const descriptor = (raw: string, partial: Partial<ChordAddDescriptor>) =>
    jasmine.objectContaining({
      raw,
      quality: null,
      extensions: [],
      additions: [],
      suspensions: [],
      alterations: [],
      modifiers: [],
      ...partial,
    });
  const testText = `Strophe
C D E F G A H
Text Line 1-1
 a d e f g a h c b
Text Line 2-1

Strophe
C D E F G A H
Text Line 1-2
 a d e f g a h c b
Text Line 2-2

Refrain
c c# db c7   cmaj7    c/e
and the chorus

Bridge
Cool bridge without any chords
`;

  beforeEach(() => void TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    void expect(service).toBeTruthy();
  });

  it('should parse section types', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const sections = service.parse(testText, null);
    void expect(sections[0].type).toBe(SectionType.Verse);
    void expect(sections[0].number).toBe(0);
    void expect(sections[1].type).toBe(SectionType.Verse);
    void expect(sections[1].number).toBe(1);
    void expect(sections[2].type).toBe(SectionType.Chorus);
    void expect(sections[2].number).toBe(0);
    void expect(sections[3].type).toBe(SectionType.Bridge);
    void expect(sections[3].number).toBe(0);
  });

  it('should parse text lines', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const sections = service.parse(testText, null);
    void expect(sections[0].lines[1].type).toBe(LineType.text);
    void expect(sections[0].lines[1].text).toBe('Text Line 1-1');
    void expect(sections[0].lines[3].type).toBe(LineType.text);
    void expect(sections[0].lines[3].text).toBe('Text Line 2-1');
    void expect(sections[1].lines[1].type).toBe(LineType.text);
    void expect(sections[1].lines[1].text).toBe('Text Line 1-2');
    void expect(sections[1].lines[3].type).toBe(LineType.text);
    void expect(sections[1].lines[3].text).toBe('Text Line 2-2');
    void expect(sections[2].lines[1].type).toBe(LineType.text);
    void expect(sections[2].lines[1].text).toBe('and the chorus');
    void expect(sections[3].lines[0].type).toBe(LineType.text);
    void expect(sections[3].lines[0].text).toBe('Cool bridge without any chords');
  });

  it('should parse chord lines', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const sections = service.parse(testText, null);
    void expect(sections[0].lines[0].type).toBe(LineType.chord);
    void expect(sections[0].lines[0].text).toBe('C D E F G A H');
    void expect(sections[0].lines[2].type).toBe(LineType.chord);
    void expect(sections[0].lines[2].text).toBe(' a d e f g a h c b');
    void expect(sections[1].lines[0].type).toBe(LineType.chord);
    void expect(sections[1].lines[0].text).toBe('C D E F G A H');
    void expect(sections[1].lines[2].type).toBe(LineType.chord);
    void expect(sections[1].lines[2].text).toBe(' a d e f g a h c b');
    void expect(sections[2].lines[0].type).toBe(LineType.chord);
    void expect(sections[2].lines[0].text).toBe('c c♯ d♭ c7   cmaj7    c/e');

    // c c# db c7   cmaj7    c/e
    void expect(sections[2].lines[0].chords).toEqual([
      {chord: 'c', length: 1, position: 0, add: null, slashChord: null, addDescriptor: null},
      {chord: 'c#', length: 2, position: 2, add: null, slashChord: null, addDescriptor: null},
      {chord: 'db', length: 2, position: 5, add: null, slashChord: null, addDescriptor: null},
      {chord: 'c', length: 2, position: 8, add: '7', slashChord: null, addDescriptor: descriptor('7', {extensions: ['7']})},
      {chord: 'c', length: 5, position: 13, add: 'maj7', slashChord: null, addDescriptor: descriptor('maj7', {quality: 'major', extensions: ['7']})},
      {chord: 'c', length: 3, position: 22, add: null, slashChord: 'e', addDescriptor: null},
    ]);
  });

  it('should parse chords with a lot of symbols', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const text = `Strophe
g#       F#         E          g#       F#          E
text`;
    const sections = service.parse(text, null);
    void expect(sections[0].lines[0].type).toBe(LineType.chord);
    void expect(sections[0].lines[0].text).toBe('g♯       F♯         E          g♯       F♯          E');
    void expect(sections[0].lines[1].type).toBe(LineType.text);
    void expect(sections[0].lines[1].text).toBe('text');
  });

  it('should ignore indented comment lines when comments are disabled', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const text = `Strophe
  # hidden comment
Text`;

    const sections = service.parse(text, null, false);

    void expect(sections[0].lines.length).toBe(1);
    void expect(sections[0].lines[0].text).toBe('Text');
  });

  it('should accept section headers with numbering and lowercase letters', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const text = `strophe 1
Text A
Refrain 2
Text B`;

    const sections = service.parse(text, null);

    void expect(sections.length).toBe(2);
    void expect(sections[0].type).toBe(SectionType.Verse);
    void expect(sections[1].type).toBe(SectionType.Chorus);
  });

  it('should return an empty array for empty input', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);

    void expect(service.parse('', null)).toEqual([]);
  });

  it('should ignore content before the first recognized section header', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const text = `Intro ohne Section
Noch eine Zeile
Strophe
Text`;

    const sections = service.parse(text, null);

    void expect(sections.length).toBe(1);
    void expect(sections[0].lines.length).toBe(1);
    void expect(sections[0].lines[0].text).toBe('Text');
  });

  it('should keep comment lines when comments are enabled', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const text = `Strophe
# Kommentar
Text`;

    const sections = service.parse(text, null, true);

    void expect(sections[0].lines.length).toBe(2);
    void expect(sections[0].lines[0].text).toBe('# Kommentar');
    void expect(sections[0].lines[1].text).toBe('Text');
  });

  it('should support windows line endings', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const text = 'Strophe\r\nC D E\r\nText\r\nRefrain\r\nG A H';

    const sections = service.parse(text, null);

    void expect(sections.length).toBe(2);
    void expect(sections[0].lines[0].type).toBe(LineType.chord);
    void expect(sections[1].lines[0].type).toBe(LineType.chord);
  });

  it('should not classify ordinary text with isolated note letters as a chord line', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const text = `Strophe
Anna geht heute baden
Text`;

    const sections = service.parse(text, null);

    void expect(sections[0].lines[0].type).toBe(LineType.text);
    void expect(sections[0].lines[0].chords).toBeNull();
  });

  it('should preserve exact chord positions for spaced chord lines', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const text = `Strophe
C       G/B      Am
Text`;

    const sections = service.parse(text, null);

    void expect(sections[0].lines[0].chords).toEqual([
      {chord: 'C', length: 1, position: 0, add: null, slashChord: null, addDescriptor: null},
      {chord: 'G', length: 3, position: 8, add: null, slashChord: 'B', addDescriptor: null},
      {chord: 'A', length: 2, position: 17, add: 'm', slashChord: null, addDescriptor: descriptor('m', {quality: 'minor'})},
    ]);
  });

  it('should parse common international chord suffixes and slash chords after the suffix', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const text = `Strophe
Cmaj7 Dm7 Gsus4 Aadd9 Cmaj7/E
Text`;

    const sections = service.parse(text, null);

    void expect(sections[0].lines[0].type).toBe(LineType.chord);
    void expect(sections[0].lines[0].chords).toEqual([
      {chord: 'C', length: 5, position: 0, add: 'maj7', slashChord: null, addDescriptor: descriptor('maj7', {quality: 'major', extensions: ['7']})},
      {chord: 'D', length: 3, position: 6, add: 'm7', slashChord: null, addDescriptor: descriptor('m7', {quality: 'minor', extensions: ['7']})},
      {chord: 'G', length: 5, position: 10, add: 'sus4', slashChord: null, addDescriptor: descriptor('sus4', {suspensions: ['4']})},
      {chord: 'A', length: 5, position: 16, add: 'add9', slashChord: null, addDescriptor: descriptor('add9', {additions: ['9']})},
      {chord: 'C', length: 7, position: 22, add: 'maj7', slashChord: 'E', addDescriptor: descriptor('maj7', {quality: 'major', extensions: ['7']})},
    ]);
  });

  it('should parse german chord suffixes', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const text = `Strophe
Hmoll Edur Cverm Faug
Text`;

    const sections = service.parse(text, null);

    void expect(sections[0].lines[0].type).toBe(LineType.chord);
    void expect(sections[0].lines[0].chords).toEqual([
      {chord: 'H', length: 5, position: 0, add: 'moll', slashChord: null, addDescriptor: descriptor('moll', {quality: 'minor'})},
      {chord: 'E', length: 4, position: 6, add: 'dur', slashChord: null, addDescriptor: descriptor('dur', {quality: 'major'})},
      {chord: 'C', length: 5, position: 11, add: 'verm', slashChord: null, addDescriptor: descriptor('verm', {quality: 'diminished'})},
      {chord: 'F', length: 4, position: 17, add: 'aug', slashChord: null, addDescriptor: descriptor('aug', {quality: 'augmented'})},
    ]);
  });

  it('should parse numeric and altered chord suffixes', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const text = `Strophe
C7 D9 E11 F13 Gadd#9 A7-5
Text`;

    const sections = service.parse(text, null);

    void expect(sections[0].lines[0].chords).toEqual([
      {chord: 'C', length: 2, position: 0, add: '7', slashChord: null, addDescriptor: descriptor('7', {extensions: ['7']})},
      {chord: 'D', length: 2, position: 3, add: '9', slashChord: null, addDescriptor: descriptor('9', {extensions: ['9']})},
      {chord: 'E', length: 3, position: 6, add: '11', slashChord: null, addDescriptor: descriptor('11', {extensions: ['11']})},
      {chord: 'F', length: 3, position: 10, add: '13', slashChord: null, addDescriptor: descriptor('13', {extensions: ['13']})},
      {chord: 'G', length: 6, position: 14, add: 'add#9', slashChord: null, addDescriptor: descriptor('add#9', {additions: ['#9']})},
      {chord: 'A', length: 4, position: 21, add: '7-5', slashChord: null, addDescriptor: descriptor('7-5', {extensions: ['7'], alterations: ['-5']})},
    ]);
  });

  it('should parse lowercase roots with suffixes and slash chords', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const text = `Strophe
emoll d/F# cmaj7/e
Text`;

    const sections = service.parse(text, null);

    void expect(sections[0].lines[0].chords).toEqual([
      {chord: 'e', length: 5, position: 0, add: 'moll', slashChord: null, addDescriptor: descriptor('moll', {quality: 'minor'})},
      {chord: 'd', length: 4, position: 6, add: null, slashChord: 'F#', addDescriptor: null},
      {chord: 'c', length: 7, position: 11, add: 'maj7', slashChord: 'e', addDescriptor: descriptor('maj7', {quality: 'major', extensions: ['7']})},
    ]);
  });

  it('should treat compact prose-like tokens as text when the chord ratio is too low', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const text = `Strophe
Das ist C nicht D sondern Text
Text`;

    const sections = service.parse(text, null);

    void expect(sections[0].lines[0].type).toBe(LineType.text);
    void expect(sections[0].lines[0].chords).toBeNull();
  });

  it('should call the transpose service when a transpose mode is provided', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const transposeService = TestBed.inject(TransposeService);
    const transposeSpy = spyOn(transposeService, 'transpose').and.callThrough();
    const renderSpy = spyOn(transposeService, 'renderChords').and.callThrough();
    const text = `Strophe
C D E
Text`;

    service.parse(text, {baseKey: 'C', targetKey: 'D'});

    void expect(transposeSpy).toHaveBeenCalledTimes(2);
    void expect(renderSpy).not.toHaveBeenCalled();
  });

  it('should use renderChords when no transpose mode is provided', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const transposeService = TestBed.inject(TransposeService);
    const transposeSpy = spyOn(transposeService, 'transpose').and.callThrough();
    const renderSpy = spyOn(transposeService, 'renderChords').and.callThrough();
    const text = `Strophe
C D E
Text`;

    service.parse(text, null);

    void expect(renderSpy).toHaveBeenCalledTimes(2);
    void expect(transposeSpy).not.toHaveBeenCalled();
  });

  it('should expose semantic descriptors for complex chord additions', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const text = `Strophe
Cmaj7(add9) Dm7 Gsus4 A7-5
Text`;

    const sections = service.parse(text, null);
    const chords = sections[0].lines[0].chords ?? [];

    void expect(chords[0].addDescriptor).toEqual(
      descriptor('maj7(add9)', {
        quality: 'major',
        extensions: ['7'],
        modifiers: ['(add9)'],
      })
    );
    void expect(chords[1].addDescriptor).toEqual(descriptor('m7', {quality: 'minor', extensions: ['7']}));
    void expect(chords[2].addDescriptor).toEqual(descriptor('sus4', {suspensions: ['4']}));
    void expect(chords[3].addDescriptor).toEqual(descriptor('7-5', {extensions: ['7'], alterations: ['-5']}));
  });

  it('should report non-canonical sharp and flat aliases on chord lines', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const text = `Strophe
Fis Hmoll Des/Fis
Text`;

    void expect(service.validateChordNotation(text)).toEqual([
      jasmine.objectContaining({lineNumber: 2, token: 'Fis', suggestion: 'F#', reason: 'alias'}),
      jasmine.objectContaining({lineNumber: 2, token: 'Hmoll', suggestion: 'h', reason: 'minor_format'}),
      jasmine.objectContaining({lineNumber: 2, token: 'Des/Fis', suggestion: 'Db/F#', reason: 'alias'}),
    ]);
  });

  it('should report uppercase minor and lowercase major chord notation', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const text = `Strophe
Am Dm7 cdur C
Text`;

    void expect(service.validateChordNotation(text)).toEqual([
      jasmine.objectContaining({lineNumber: 2, token: 'Am', suggestion: 'a', reason: 'minor_format'}),
      jasmine.objectContaining({lineNumber: 2, token: 'Dm7', suggestion: 'd7', reason: 'minor_format'}),
      jasmine.objectContaining({lineNumber: 2, token: 'cdur', suggestion: 'C', reason: 'major_format'}),
    ]);
  });

  it('should ignore prose lines even if they contain note-like words', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const text = `Strophe
Heute singt Fis nicht mit
Text`;

    void expect(service.validateChordNotation(text)).toEqual([]);
  });

  it('should keep mostly-chord lines with unknown tokens in chord mode', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const text = `Strophe
C Es G
Text`;

    const sections = service.parse(text, null);

    void expect(sections[0].lines[0].type).toBe(LineType.chord);
    void expect(sections[0].lines[0].text).toBe('C Es G');
    void expect(service.validateChordNotation(text)).toEqual([
      jasmine.objectContaining({lineNumber: 2, token: 'Es', reason: 'alias', suggestion: 'Eb'}),
    ]);
  });

  it('should flag unknown tokens on mostly chord lines', () => {
    const service: TextRenderingService = TestBed.inject(TextRenderingService);
    const text = `Strophe
C Foo G a
Text`;

    void expect(service.validateChordNotation(text)).toEqual([
      jasmine.objectContaining({lineNumber: 2, token: 'Foo', reason: 'unknown_token', suggestion: null}),
    ]);
  });
});
