package com.google.UVIS.common.GS1;

import android.util.Log;
import com.google.UVIS.FormatException;

/**
 * Created by kellerberrin on 20/04/2014.
 * Implements a class to hold a GS1 GTIN identifier.
 * Note that the GS1_GTIN object throws an exception in the constructor
 * if the initialization string is not a valid GTIN Identifier.
 * To prevent this the GTIN validity of the string should be checked with
 * static boolean GS1_GTIN.ValidGTINFormat(String) before creating the object.
 */

public class GS1_GTIN {

    protected static final int GTIN_8_Length = 8;
    protected static final int GTIN_12_Length = 12;
    protected static final int GTIN_13_Length = 13;
    protected static final int GTIN_14_Length = 14;

    private String m_GTINString;

// Constructors

    public GS1_GTIN(String GTINString) throws FormatException
    {
        if (!ValidGTINFormat(GTINString))
        {
            Log.e("GS1_GTIN.GS1_GTIN(String)", "Invalid GTIN String:" + GTINString);
            throw FormatException.getFormatInstance();
        }
        SetGTINString(GTINString);
    }

    public GS1_GTIN(GS1_GTIN Copy)throws FormatException
    {
        if (!Copy.ValidGTINFormat())
        {
            Log.e("GS1_GTIN.GS1_GTIN(Copy)", "Invalid GTIN String in copy object:" + Copy.GetGTINString());
            throw FormatException.getFormatInstance();
        }
        SetGTINString(Copy.GetGTINString());
    }

// access to the member m_GTINString;

    public final String GetGTINString() { return m_GTINString; }
    private void SetGTINString(String GTINString) { m_GTINString = GTINString; }

// static member to check a supplied string for a valid GTIN size
// and a valid GTIN check sum digit. See GS1 the website for details.
// This should be called before creating a GS1_GTIN object

    static public boolean ValidGTINFormat(String GTINString)
    {

        final int CheckSumRadix = 10;

        int CheckSumMultiplier;
        int CheckSumTotal = 0;
        int LeastSigDigit;
        int GTINCheckDigit;
        Character DigitChar;
        Character CheckSumChar;

        switch(GTINString.length())
        {

            case GTIN_8_Length:
                CheckSumMultiplier = 3;
                break;

            case GTIN_12_Length:
                CheckSumMultiplier = 3;
                break;

            case GTIN_13_Length:
                CheckSumMultiplier = 1;
                break;

            case GTIN_14_Length:
                CheckSumMultiplier = 3;
                break;

            default:
                return false;

        }

        for (int i= 0; i < GTINString.length()-1; i++)
        {
            DigitChar = GTINString.charAt(i);

            if (!Character.isDigit(DigitChar))
            {
                return false;
            }

            CheckSumTotal += CheckSumMultiplier * Character.digit(DigitChar, CheckSumRadix);

            if (CheckSumMultiplier == 3)
            {
                CheckSumMultiplier = 1;
            }
            else
            {
                CheckSumMultiplier = 3;
            }

        }

        CheckSumChar = GTINString.charAt(GTINString.length()-1);

        GTINCheckDigit = Character.digit(CheckSumChar, CheckSumRadix);

        LeastSigDigit = CheckSumTotal % CheckSumRadix;

        if (LeastSigDigit != 0)
        {

            LeastSigDigit = CheckSumRadix - LeastSigDigit;

        }

        if (GTINCheckDigit == LeastSigDigit)
        {
            return true;
        }
        else
        {
            return false;
        }

    }

// Instance validation.

    protected final boolean ValidGTINFormat() { return ValidGTINFormat(GetGTINString()); }

}
