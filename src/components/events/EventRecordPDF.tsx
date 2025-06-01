import React from "react"
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer"

import { EventRecordForExport } from "@/types/event"
import {
  formatDate,
  getLunarDateFromSolarDate,
  getLunarDateInChinese,
} from "@/lib/date"
import { getNameWithTitle } from "@/lib/name"
import { CURRENCY_FORMAT_OPTIONS, formatCurrency } from "@/lib/number"

const NUM_COLUMNS = 3
const RECORDS_PER_COLUMN = 30
const RECORDS_PER_PAGE = NUM_COLUMNS * RECORDS_PER_COLUMN

const paginateRecords = (records: EventRecordForExport["records"]) => {
  const pages: EventRecordForExport["records"][] = []

  for (let i = 0; i < records.length; i += RECORDS_PER_PAGE) {
    pages.push(records.slice(i, i + RECORDS_PER_PAGE))
  }

  return pages
}

const splitPageIntoColumns = (
  records: EventRecordForExport["records"],
  numColumns: number,
  recordsPerColumn: number
) => {
  const columns: EventRecordForExport["records"][] = Array.from(
    { length: numColumns },
    () => []
  )

  for (let i = 0; i < records.length; i++) {
    const columnIndex = Math.floor(i / recordsPerColumn)

    if (columnIndex < numColumns) {
      columns[columnIndex].push(records[i])
    }
  }

  return columns
}

Font.register({
  family: "Noto Sans TC",
  fonts: [
    { src: "/fonts/NotoSansTC-Regular.ttf" },
    { src: "/fonts/NotoSansTC-Medium.ttf", fontWeight: 500 },
    { src: "/fonts/NotoSansTC-SemiBold.ttf", fontWeight: 600 },
  ],
})

const styles = StyleSheet.create({
  page: {
    fontFamily: "Noto Sans TC",
    padding: 24,
    fontSize: 12,
    lineHeight: 1.25,
    color: "black",
    backgroundColor: "transparent",
    gap: 24,
  },
  titleSection: {
    gap: 10,
    textAlign: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
  },
  subTitle: {
    fontWeight: 500,
  },
  recordsSection: {
    flexDirection: "row",
    gap: 8,
  },
  column: {
    flex: 1,
    gap: 6,
    minHeight: 624,
  },
  columnWithBorder: {
    borderRight: "1pt solid lightgray",
    paddingRight: 8,
  },
  record: {
    flexDirection: "row",
    gap: 4,
  },
  numbering: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  donor: {
    flex: 1,
  },
  textRight: {
    textAlign: "right",
  },
  totalSection: {
    borderTop: "1pt solid lightgray",
    borderBottom: "1pt solid lightgray",
    alignSelf: "flex-end",
    paddingTop: 2,
    paddingBottom: 1,
    marginVertical: -8,
    minWidth: 180,
  },
  totalInnerSection: {
    paddingBottom: 6,
    borderBottom: "1pt solid lightgray",
    gap: 4,
  },
  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
  },
  totalLabel: {
    flexDirection: "row",
    justifyContent: "flex-end",
    minWidth: 68,
  },
  totalAmount: {
    fontWeight: 500,
  },
  footer: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 4,
    fontSize: 10,
    color: "gray",
  },
})

const EventRecordPDF = ({
  title,
  data,
  withAmount,
}: {
  title: string
  data: EventRecordForExport
  withAmount: boolean
}) => {
  const pages = paginateRecords(data.records)

  return (
    <Document title={title} author="妙音寺" subject="Donation Records">
      {pages.map((pageRecords, pageIndex) => {
        const columns = splitPageIntoColumns(
          pageRecords,
          NUM_COLUMNS,
          RECORDS_PER_COLUMN
        )

        return (
          <Page key={pageIndex} size="A4" style={styles.page}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>
                {data.name}
                {data.category}
              </Text>

              <Text style={styles.subTitle}>
                {formatDate(data.date)} (
                {getLunarDateInChinese(getLunarDateFromSolarDate(data.date))})
              </Text>
            </View>

            <View style={styles.recordsSection}>
              {columns.map((column, colIndex) => (
                <View
                  key={colIndex}
                  style={[
                    styles.column,
                    colIndex < NUM_COLUMNS - 1 ? styles.columnWithBorder : {},
                  ]}
                >
                  {column.map((record, recordIndex) => {
                    const globalIndex =
                      pageIndex * RECORDS_PER_PAGE +
                      colIndex * RECORDS_PER_COLUMN +
                      recordIndex

                    return (
                      <View key={recordIndex} style={styles.record}>
                        <View
                          style={[
                            styles.numbering,
                            {
                              minWidth: pageIndex === 0 ? 18 : 24,
                            },
                          ]}
                        >
                          <Text style={styles.textRight}>
                            {globalIndex + 1}.
                          </Text>
                        </View>

                        <Text
                          style={styles.donor}
                          hyphenationCallback={(word) => ["", word, ""]}
                        >
                          {getNameWithTitle(record.name, record.title)}
                        </Text>

                        {withAmount && (
                          <Text style={styles.textRight}>
                            {formatCurrency(record.amount || 0, undefined, {
                              ...CURRENCY_FORMAT_OPTIONS,
                              style: "decimal",
                            })}
                          </Text>
                        )}
                      </View>
                    )
                  })}
                </View>
              ))}
            </View>

            {withAmount && (
              <View style={styles.totalSection}>
                <View style={styles.totalInnerSection}>
                  <View style={styles.total}>
                    <View
                      style={
                        pageIndex === pages.length - 1
                          ? styles.totalLabel
                          : undefined
                      }
                    >
                      <Text style={styles.textRight}>Page Total:</Text>
                    </View>

                    <Text style={styles.totalAmount}>
                      {formatCurrency(
                        pageRecords.reduce(
                          (sum, record) => sum + (record.amount || 0),
                          0
                        )
                      )}
                    </Text>
                  </View>

                  {pageIndex === pages.length - 1 && (
                    <View style={styles.total}>
                      <View style={styles.totalLabel}>
                        <Text style={styles.textRight}>Grand Total:</Text>
                      </View>

                      <Text style={styles.totalAmount}>
                        {formatCurrency(
                          data.records.reduce(
                            (sum, record) => sum + (record.amount || 0),
                            0
                          )
                        )}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            <View style={styles.footer}>
              <Text>妙音寺</Text>

              <Text>
                Page {pageIndex + 1} / {pages.length}
              </Text>
            </View>
          </Page>
        )
      })}
    </Document>
  )
}

export default EventRecordPDF
