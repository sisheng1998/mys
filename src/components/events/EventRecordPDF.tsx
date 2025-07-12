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
import { Title } from "@/types/nameList"
import {
  formatDate,
  getLunarDateFromSolarDate,
  getLunarDateInChinese,
} from "@/lib/date"
import { getNameWithTitle } from "@/lib/name"
import { formatCurrency, formatNumber } from "@/lib/number"
import { isAllEnglishCharacters } from "@/lib/string"

const NUM_COLUMNS = 3
const MAX_LINES_PER_COLUMN = 30

type RecordWithEstimate = EventRecordForExport["records"][number] & {
  estimatedLines: number
}

const estimateLines = (name: string, title?: Title, withAmount?: boolean) => {
  const charactersPerLine = isAllEnglishCharacters(name)
    ? 20
    : withAmount
      ? 9
      : 12

  const fullName = getNameWithTitle(name, title)
  return Math.ceil(fullName.length / charactersPerLine)
}

const paginateAndSplit = (
  records: EventRecordForExport["records"],
  withAmount: boolean
): RecordWithEstimate[][][] => {
  const recordsWithEstimates: RecordWithEstimate[] = records.map((record) => ({
    ...record,
    estimatedLines: estimateLines(record.name, record.title, withAmount),
  }))

  const pages: RecordWithEstimate[][][] = []

  let currentPage: RecordWithEstimate[][] = []
  let currentColumn: RecordWithEstimate[] = []
  let recordCount = 0
  let lineCount = 0
  let extraLinePool = 0

  const pushColumn = () => {
    currentPage.push(currentColumn)
    currentColumn = []
    recordCount = 0
    lineCount = 0
    extraLinePool = 0
  }

  const pushPage = () => {
    while (currentPage.length < NUM_COLUMNS) {
      currentPage.push([])
    }
    pages.push(currentPage)
    currentPage = []
  }

  for (const record of recordsWithEstimates) {
    const lines = record.estimatedLines
    const extra = Math.max(0, lines - 1)

    const nextRecordCount = recordCount + 1
    const nextLineCount = lineCount + lines
    const nextExtraLinePool = extraLinePool + extra
    const bonusLines = Math.floor(nextExtraLinePool / 3)
    const allowedLines = MAX_LINES_PER_COLUMN + bonusLines

    const exceedsRecordLimit = nextRecordCount > 30
    const exceedsLineLimit = nextLineCount > allowedLines

    if (exceedsRecordLimit || exceedsLineLimit) {
      pushColumn()
      if (currentPage.length >= NUM_COLUMNS) {
        pushPage()
      }
    }

    currentColumn.push(record)
    recordCount++
    lineCount += lines
    extraLinePool += extra
  }

  if (currentColumn.length > 0) pushColumn()
  if (currentPage.length > 0) pushPage()

  return pages
}

Font.register({
  family: "Noto Sans SC",
  fonts: [
    { src: "/fonts/NotoSansSC-Regular.ttf" },
    { src: "/fonts/NotoSansSC-Medium.ttf", fontWeight: 500 },
    { src: "/fonts/NotoSansSC-SemiBold.ttf", fontWeight: 600 },
  ],
})

const styles = StyleSheet.create({
  page: {
    fontFamily: "Noto Sans SC",
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
    gap: 10,
  },
  column: {
    flex: 1,
    gap: 6,
    minHeight: 624,
  },
  columnWithBorder: {
    borderRight: "1pt solid lightgray",
    paddingRight: 10,
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
  recordAmount: {
    marginLeft: 4,
    marginRight: -4,
    flexDirection: "row",
    gap: 4,
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
    flexShrink: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    minWidth: 70,
  },
  totalLabelText: {
    textAlign: "right",
    marginRight: 2,
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
  withPaymentStatus,
  withTotal,
}: {
  title: string
  data: EventRecordForExport
  withAmount: boolean
  withPaymentStatus: boolean
  withTotal: boolean
}) => {
  const pages = paginateAndSplit(data.records, withAmount)

  let globalIndex = 0

  return (
    <Document title={title} author="妙音寺" subject="Donation Records">
      {pages.map((columns, pageIndex) => {
        const pageRecords = columns.flat()

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
                    const index = globalIndex++

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
                          <Text style={styles.textRight}>{index + 1}.</Text>
                        </View>

                        <Text
                          style={styles.donor}
                          hyphenationCallback={(word) => ["", word, ""]}
                        >
                          {getNameWithTitle(record.name, record.title)}
                        </Text>

                        {(withAmount || withPaymentStatus) && (
                          <View style={styles.recordAmount}>
                            {withAmount && (
                              <Text style={styles.textRight}>
                                {formatNumber(record.amount || 0)}
                              </Text>
                            )}

                            {withPaymentStatus && (
                              <Text
                                style={{
                                  color: record.isPaid
                                    ? "black"
                                    : "transparent",
                                }}
                              >
                                ✓
                              </Text>
                            )}
                          </View>
                        )}
                      </View>
                    )
                  })}
                </View>
              ))}
            </View>

            {withTotal && (
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
                      <Text style={styles.totalLabelText}>Page Total:</Text>
                    </View>

                    <Text style={styles.totalAmount}>
                      {formatCurrency(
                        pageRecords.reduce(
                          (sum, record) => sum + (record.amount || 0),
                          0
                        )
                      )}{" "}
                      {withPaymentStatus && (
                        <>
                          (
                          {formatCurrency(
                            pageRecords
                              .filter((record) => record.isPaid)
                              .reduce(
                                (sum, record) => sum + (record.amount || 0),
                                0
                              )
                          )}{" "}
                          Paid)
                        </>
                      )}
                    </Text>
                  </View>

                  {pageIndex === pages.length - 1 && (
                    <View style={styles.total}>
                      <View style={styles.totalLabel}>
                        <Text style={styles.totalLabelText}>Grand Total:</Text>
                      </View>

                      <Text style={styles.totalAmount}>
                        {formatCurrency(
                          data.records.reduce(
                            (sum, record) => sum + (record.amount || 0),
                            0
                          )
                        )}{" "}
                        {withPaymentStatus && (
                          <>
                            (
                            {formatCurrency(
                              data.records
                                .filter((record) => record.isPaid)
                                .reduce(
                                  (sum, record) => sum + (record.amount || 0),
                                  0
                                )
                            )}{" "}
                            Paid)
                          </>
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
