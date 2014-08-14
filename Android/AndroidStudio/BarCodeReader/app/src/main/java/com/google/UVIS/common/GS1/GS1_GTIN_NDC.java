package com.google.UVIS.common.GS1;

import android.util.Log;

import com.google.UVIS.FormatException;

/**
 * Created by kellerberrin on 20/04/2014.
 * Implements a class to hold a GS1 GTIN (United States National Drug Code) NDC identifier.
 * Note that the GS1_GTIN_NDC throws an exception in the constructor
 * if the object initialization is not with not a valid GTIN NDC Identifier.
 * The GTIN NDC validity of the constructor initialization string should be checked
 * with static boolean GS1_GTIN_NDC.ValidGTINNDCFormat(String) before creating the object.
 */
public class GS1_GTIN_NDC extends GS1_GTIN {

    private static final String GTIN12_NDC_PREFIX = "3";
    private static final String GTIN14_NDC_PREFIX = "003";

// Constructors

    public GS1_GTIN_NDC(String GTINNDCString) throws FormatException
    {
        super(GTINNDCString);
        if (!ValidGTINNDCFormat(GTINNDCString))
        {
            Log.d("GS1_GTIN_NDC.GS1_GTIN_NDC", "Invalid NDC GTIN:" + GTINNDCString);
            throw FormatException.getFormatInstance();
        }
    }

    public GS1_GTIN_NDC(GS1_GTIN_NDC Copy) throws FormatException
    {
        super(Copy);
        if (!Copy.ValidGTINNDCFormat())
        {
            Log.e("GS1_GTIN.GS1_GTIN(Copy)", "Invalid GTIN NDC String in copy constructor:" + GetGTINString());
            throw FormatException.getFormatInstance();
        }
    }

// Static member to check a candidate string if it is a valid GTIN and is in a format
// that can contain a valid United States National Drug Code (NDC).
// Note the validity of the actual NDC is NOT checked here.
// Valid formats are; 12 digit GTIN - (1 digit) "3" (10 digits) NDC (1 digit) CheckDigit.
// 14 digit GTIN -(3 digits) "003" (10 digits) NDC (1 digit) CheckDigit.

    static public boolean ValidGTINNDCFormat(String GTINNDCString)
    {

        if (GTINNDCString.length() == GTIN_12_Length)
        {

            if (GTINNDCString.substring(0, GTIN12_NDC_PREFIX.length()).equals(GTIN12_NDC_PREFIX))
            {
                return  ValidGTINFormat(GTINNDCString);
            }

        }

        if (GTINNDCString.length() == GTIN_14_Length)
        {

            if (GTINNDCString.substring(0, GTIN14_NDC_PREFIX.length()).equals(GTIN14_NDC_PREFIX))
            {
                return  ValidGTINFormat(GTINNDCString);
            }

        }

        return false;

    }

// Extract the NDC Code string from the GTIN
// Assumes that the object contains a valid GTIN NDC identifier
// and throws a format exception if it does not.

    public GS1_NDC GetNDC() throws FormatException
    {
        String NDCString = "";


        if (GetGTINString().length() == GTIN_12_Length)
        {
            NDCString = GetGTINString().substring( GTIN12_NDC_PREFIX.length()
                                           , GS1_NDC.NDC_Size + GTIN12_NDC_PREFIX.length());
        }

        if (GetGTINString().length() == GTIN_14_Length)
        {

            NDCString = GetGTINString().substring( GTIN14_NDC_PREFIX.length()
                                           , GS1_NDC.NDC_Size + GTIN14_NDC_PREFIX.length());

        }

        if (!GS1_NDC.ValidNDCFormat(NDCString))
        {
            Log.e("GS1_GTIN.GS1_NDC()", "Invalid NDC String in GTIN:" + GetGTINString());
            throw FormatException.getFormatInstance();
        }

        return new GS1_NDC(NDCString);

    }

// Instance validation.

    protected final boolean ValidGTINNDCFormat() { return ValidGTINNDCFormat(GetGTINString()); }

}
