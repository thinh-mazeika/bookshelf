import {formatDate} from '../misc'

test('formatDate formats the date to look nice', () => {
  expect(formatDate(new Date('September 14, 1991'))).toBe('Sep 91')
})
